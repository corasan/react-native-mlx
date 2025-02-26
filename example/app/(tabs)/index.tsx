import { Text, View } from '@/components/Themed'
import { LegendList, type LegendListRef } from '@legendapp/list'
import * as Crypto from 'expo-crypto'
import { useEffect, useRef, useState } from 'react'
import {
  InteractionManager,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { MLX } from 'react-native-mlx'
import type { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Message = {
  id: string
  content: string
  isUser: boolean
}

const MessageItem = ({ id, content, isUser }: Message) => {
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

const llm = new MLX()

export default function TabOneScreen() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [prompt, setPrompt] = useState('Why is the sky blue?')
  const [tokens, setTokens] = useState<string>('')
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'
  const bgColor = colorScheme === 'dark' ? 'black' : 'white'
  const [messages, setMessages] = useState<Message[]>([])
  const [, setIsGenerating] = useState(false)
  const [disableScrollOnSizeChange, setDisableScrollOnSizeChange] = useState(false)
  const listRef = useRef<LegendListRef>(null)
  const inputRef = useRef<TextInput>(null)

  const sendPrompt = async () => {
    if (!modelLoaded) return
    const id = Crypto.randomUUID()
    const message = { id, content: prompt, isUser: true }
    setPrompt('')
    inputRef.current?.blur()
    setMessages(prevMessages => [...prevMessages, message])
    await llm.generate(prompt)
  }

  useEffect(() => {
    const loadModel = async () => {
      await llm.load('llama-3.1b-instruct-4bit')

      setModelLoaded(true)
    }
    loadModel()

    const tokenListener = llm.addEventListener('onTokenGeneration', payload => {
      setTokens(payload.text)
    })

    const stateListener = llm.addEventListener('onStateChange', payload => {
      setIsGenerating(payload.isGenerating)
    })

    return () => {
      llm.removeEventListener(tokenListener)
      llm.removeEventListener(stateListener)
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: need
  useEffect(() => {
    if (llm.response && !llm.isGenerating) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Crypto.randomUUID(), content: llm.response.trim(), isUser: false },
      ])
    }
  }, [llm.isGenerating, llm.response])

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={['bottom']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: bgColor }]}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 120, default: 95 })}
      >
        <LegendList
          ref={listRef}
          data={messages}
          keyExtractor={(i, k) => k.toString()}
          estimatedItemSize={100}
          renderItem={({ item }) => <MessageItem key={item.id} {...item} />}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainVisibleContentPosition
          onContentSizeChange={() => {
            if (llm.isGenerating) {
              listRef?.current?.scrollToEnd({ animated: false })
            }
          }}
          onScrollBeginDrag={() => {
            setDisableScrollOnSizeChange(true)
          }}
          onScrollEndDrag={() => {
            setTimeout(() => {
              setDisableScrollOnSizeChange(false)
            }, 2_500)
          }}
          ListFooterComponent={() => {
            if (!llm.isGenerating) return null
            return (
              <>
                <MessageItem
                  id={Crypto.randomUUID()}
                  content={tokens.trim()}
                  isUser={false}
                />
                <View style={{ height: 30 }} />
              </>
            )
          }}
        />

        {modelLoaded && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#c4c4c62f',
              borderRadius: 10,
              width: '100%',
            }}
          >
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter your prompt"
              ref={inputRef}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                flex: 1,
                fontSize: 18,
                padding: 10,
                color: textColor,
              }}
            />
            <TouchableOpacity onPress={sendPrompt}>
              <Text
                style={{
                  color: 'black',
                  padding: 10,
                  backgroundColor: 'white',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  borderWidth: 1,
                  borderColor: '#c4c4c62f',
                  flex: 1,
                  fontSize: 16,
                }}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  message: {
    padding: 18,
    backgroundColor: 'transparent',
  },
  userMessage: {
    padding: 18,
    backgroundColor: '#c4c4c62f',
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginRight: 10,
  },
})
