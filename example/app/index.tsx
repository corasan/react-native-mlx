import { LegendList, type LegendListRef } from '@legendapp/list'
import * as Crypto from 'expo-crypto'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { createLLM, createModelManager, LLMEvents } from 'react-native-mlx'
import { SafeAreaView } from 'react-native-safe-area-context'

const MODEL_ID = 'mlx-community/SmolLM-135M-Instruct-4bit'

type Message = {
  id: string
  content: string
  isUser: boolean
}

const MessageItem = ({ content, isUser }: Message) => {
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'

  if (isUser) {
    return (
      <View style={styles.userMessage}>
        <Text style={[styles.messageText, { color: textColor }]}>{content}</Text>
      </View>
    )
  }
  return (
    <View style={styles.message}>
      <Text style={[styles.messageText, { color: textColor }]}>{content}</Text>
    </View>
  )
}

export default function ChatScreen() {
  const [isChecking, setIsChecking] = useState(true)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [currentResponse, setCurrentResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'
  const bgColor = colorScheme === 'dark' ? 'black' : 'white'
  const [messages, setMessages] = useState<Message[]>([])
  const listRef = useRef<LegendListRef>(null)
  const inputRef = useRef<TextInput>(null)
  const llmRef = useRef(createLLM())
  const modelManagerRef = useRef(createModelManager())

  const checkDownloaded = useCallback(async () => {
    setIsChecking(true)
    try {
      const downloaded = await modelManagerRef.current.isDownloaded(MODEL_ID)
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
      try {
        const llm = llmRef.current
        llm.addEventListener(LLMEvents.onToken, token => {
          setCurrentResponse(prev => prev + token)
        })
        llm.addEventListener(LLMEvents.onComplete, () => {
          setIsGenerating(false)
        })
        llm.addEventListener(LLMEvents.onError, error => {
          console.error('LLM Error:', error)
          setIsGenerating(false)
        })

        await llm.load(MODEL_ID)
        setIsReady(true)
      } catch (error) {
        console.error('Error loading model:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadModel()
  }, [isDownloaded, isReady])

  useEffect(() => {
    if (!isGenerating && currentResponse) {
      const assistantMessage: Message = {
        id: Crypto.randomUUID(),
        content: currentResponse.trim(),
        isUser: false,
      }
      setMessages(prev => [...prev, assistantMessage])
      setCurrentResponse('')
    }
  }, [isGenerating, currentResponse])

  const sendPrompt = async () => {
    if (!isReady || !prompt.trim() || isGenerating) return

    const userMessage: Message = {
      id: Crypto.randomUUID(),
      content: prompt,
      isUser: true,
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    inputRef.current?.blur()
    setIsGenerating(true)
    setCurrentResponse('')

    try {
      await llmRef.current.generate(prompt)
    } catch (error) {
      console.error('Error generating:', error)
      setIsGenerating(false)
    }
  }

  const openDownloadModal = () => {
    router.push('/download-modal')
  }

  const deleteModel = async () => {
    try {
      await modelManagerRef.current.deleteModel(MODEL_ID)
      setIsDownloaded(false)
      setIsReady(false)
      setMessages([])
    } catch (error) {
      console.error('Error deleting model:', error)
    }
  }

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
        <Text style={[styles.statusText, { color: textColor }]}>Loading model...</Text>
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
          <Text style={[styles.headerTitle, { color: textColor }]}>MLX Chat</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteModel}>
            <Text style={styles.deleteButtonText}>Delete Model</Text>
          </TouchableOpacity>
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
          ListFooterComponent={() => {
            if (!isGenerating || !currentResponse) return null
            return (
              <View style={styles.message}>
                <Text style={[styles.messageText, { color: textColor }]}>
                  {currentResponse.trim()}
                </Text>
              </View>
            )
          }}
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
})
