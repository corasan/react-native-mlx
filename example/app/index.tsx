import { LegendList, type LegendListRef } from '@legendapp/list'
import * as Crypto from 'expo-crypto'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { LLM, MLXModel, ModelManager } from 'react-native-nitro-mlx'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBenchmark } from '../components/benchmark-context'

const MODEL_ID = MLXModel.Llama_3_2_1B_Instruct_4bit

type Message = {
  id: string
  content: string
  thinking?: string
  isThinking?: boolean
  isUser: boolean
}

const ThinkingBlock = ({ thinking }: { thinking: string }) => {
  const [expanded, setExpanded] = useState(false)
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? '#aaa' : '#666'

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(!expanded)
  }

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.thinkingBlock}>
      <View style={styles.thinkingHeader}>
        <Text style={[styles.thinkingLabel, { color: textColor }]}>
          {expanded ? '▼' : '▶'} Thinking
        </Text>
      </View>
      {expanded && (
        <Text style={[styles.thinkingText, { color: textColor }]}>{thinking}</Text>
      )}
    </TouchableOpacity>
  )
}

const MessageItem = ({ content, thinking, isThinking, isUser }: Message) => {
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'

  if (isUser) {
    return (
      <View style={styles.userMessage}>
        <Text style={[styles.messageText, { color: 'white' }]}>{content}</Text>
      </View>
    )
  }

  return (
    <View style={styles.message}>
      {isThinking && !content && (
        <View style={styles.thinkingIndicator}>
          <ActivityIndicator size="small" color="#888" />
          <Text style={[styles.thinkingIndicatorText, { color: textColor }]}>
            Thinking...
          </Text>
        </View>
      )}
      {thinking && <ThinkingBlock thinking={thinking} />}
      {content ? (
        <Text style={[styles.messageText, { color: textColor }]}>{content}</Text>
      ) : null}
    </View>
  )
}

export default function ChatScreen() {
  const [isChecking, setIsChecking] = useState(true)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'
  const bgColor = colorScheme === 'dark' ? 'black' : 'white'
  const [messages, setMessages] = useState<Message[]>([])
  const listRef = useRef<LegendListRef>(null)
  const inputRef = useRef<TextInput>(null)
  const { addResult } = useBenchmark()

  LLM.debug = true

  const openSettings = () => {
    router.push('/settings-modal')
  }

  const checkDownloaded = useCallback(async () => {
    setIsChecking(true)
    try {
      const downloaded = await ModelManager.isDownloaded(MODEL_ID)
      setIsDownloaded(downloaded)
    } catch (error) {
      console.error('Error checking download:', error)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      checkDownloaded()
    }, [checkDownloaded]),
  )

  useEffect(() => {
    if (!isDownloaded || isReady) return

    const loadModel = async () => {
      setIsLoading(true)
      setLoadProgress(0)
      try {
        await LLM.load(MODEL_ID, {
          onProgress: setLoadProgress,
          // additionalContext: [{ role: 'user', content: 'What is quantum computing?' }],
          manageHistory: true,
        })
        setIsReady(true)
      } catch (error) {
        console.error('Error loading model:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadModel()
  }, [isDownloaded, isReady])

  const sendPrompt = async () => {
    if (!isReady || !prompt.trim() || isGenerating) return

    const currentPrompt = prompt
    const assistantMessageId = Crypto.randomUUID()
    const tempAssistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      thinking: '',
      isThinking: false,
      isUser: false,
    }

    setMessages(prev => [
      ...prev,
      { id: Crypto.randomUUID(), content: currentPrompt, isUser: true },
      tempAssistantMessage,
    ])
    setPrompt('')
    inputRef.current?.blur()
    setIsGenerating(true)

    let fullText = ''
    let isInThinkingBlock = false

    try {
      await LLM.stream(currentPrompt, token => {
        fullText += token

        const thinkStart = fullText.indexOf('<think>')
        const thinkEnd = fullText.indexOf('</think>')

        let thinkingContent = ''
        let responseContent = ''

        if (thinkStart !== -1) {
          if (thinkEnd !== -1) {
            thinkingContent = fullText.slice(thinkStart + 7, thinkEnd).trim()
            responseContent = fullText.slice(thinkEnd + 8).trim()
            isInThinkingBlock = false
          } else {
            thinkingContent = fullText.slice(thinkStart + 7).trim()
            isInThinkingBlock = true
          }
        } else {
          responseContent = fullText.trim()
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  thinking: thinkingContent,
                  content: responseContent,
                  isThinking: isInThinkingBlock,
                }
              : msg,
          ),
        )
      })

      syncFromHistory()

      const stats = LLM.getLastGenerationStats()
      addResult({
        tokensPerSecond: stats.tokensPerSecond,
        timeToFirstToken: stats.timeToFirstToken,
        totalTokens: stats.tokenCount,
        totalTime: stats.totalTime,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error('Error generating:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const openDownloadModal = () => {
    router.push('/download-modal')
  }

  const deleteModel = async () => {
    try {
      await ModelManager.deleteModel(MODEL_ID)
      setIsDownloaded(false)
      setIsReady(false)
      setMessages([])
    } catch (error) {
      console.error('Error deleting model:', error)
    }
  }

  const syncFromHistory = useCallback(() => {
    try {
      const history = LLM.getHistory()
      const uiMessages: Message[] = history.map((msg, index) => {
        if (msg.role === 'user') {
          return {
            id: `history-${index}`,
            content: msg.content,
            isUser: true,
          }
        }

        const fullText = msg.content
        const thinkStart = fullText.indexOf('<think>')
        const thinkEnd = fullText.indexOf('</think>')

        let thinking = ''
        let content = fullText

        if (thinkStart !== -1 && thinkEnd !== -1) {
          thinking = fullText.slice(thinkStart + 7, thinkEnd).trim()
          content = fullText.slice(thinkEnd + 8).trim()
        }

        return {
          id: `history-${index}`,
          content,
          thinking,
          isUser: false,
        }
      })
      setMessages(uiMessages)
    } catch (error) {
      console.error('Error syncing from history:', error)
    }
  }, [])

  const logHistory = () => {
    try {
      const history = LLM.getHistory()
      console.log('Message History:', history)
      console.log('Total messages:', history.length)
    } catch (error) {
      console.error('Error getting history:', error)
    }
  }

  const handleClearHistory = () => {
    try {
      LLM.clearHistory()
      setMessages([])
      console.log('History cleared')
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  useEffect(() => {
    if (isReady) {
      syncFromHistory()
    }
  }, [isReady, syncFromHistory])

  if (isChecking) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" />
        <Text style={[styles.statusText, { color: textColor }]}>Checking model...</Text>
      </SafeAreaView>
    )
  }

  if (!isDownloaded) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={[styles.title, { color: textColor }]}>MLX Chat</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Download the model to get started
        </Text>
        <TouchableOpacity style={styles.downloadButton} onPress={openDownloadModal}>
          <Text style={styles.downloadButtonText}>Download Model</Text>
        </TouchableOpacity>
        <Text style={[styles.modelId, { color: textColor }]}>{MODEL_ID}</Text>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" />
        <Text style={[styles.statusText, { color: textColor }]}>
          Loading model... {(loadProgress * 100).toFixed(0)}%
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={['bottom', 'top']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: bgColor }]}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 0, default: 0 })}
      >
        <View
          style={[
            styles.header,
            { borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee' },
          ]}
        >
          <TouchableOpacity onPress={openSettings}>
            <Text style={[styles.headerButton, { color: '#007AFF' }]}>Benchmark</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>MLX Chat</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.historyButton} onPress={logHistory}>
              <Text style={styles.historyButtonText}>Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteModel}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <LegendList<Message>
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          estimatedItemSize={100}
          renderItem={({ item }) => <MessageItem key={item.id} {...item} />}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainVisibleContentPosition
        />

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={[styles.input, { color: textColor }]}
            editable={!isGenerating}
            onSubmitEditing={sendPrompt}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!prompt.trim() || isGenerating) && styles.sendButtonDisabled,
            ]}
            onPress={sendPrompt}
            disabled={!prompt.trim() || isGenerating}
          >
            <Text style={styles.sendButtonText}>{isGenerating ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  historyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#34C759',
  },
  historyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FF9500',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
    textAlign: 'center',
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  modelId: {
    marginTop: 16,
    fontSize: 12,
    opacity: 0.5,
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  message: {
    padding: 16,
    paddingHorizontal: 20,
  },
  userMessage: {
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderRadius: 16,
    marginRight: 12,
    marginVertical: 4,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#c4c4c62f',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  thinkingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  thinkingIndicatorText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  thinkingBlock: {
    backgroundColor: '#8881',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  thinkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thinkingLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  thinkingText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    fontStyle: 'italic',
  },
})
