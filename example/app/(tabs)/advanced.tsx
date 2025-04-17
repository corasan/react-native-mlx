import { Text, View } from '@/components/Themed'
import { LegendList, type LegendListRef } from '@legendapp/list'
import * as Crypto from 'expo-crypto'
import { useEffect, useRef, useState } from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useMLXGeneration } from 'react-native-mlx'
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

export default function AdvancedChatScreen() {
  // Use the new hook with streaming capabilities
  const { text, generate, isLoading, isGenerating, error, abort } = useMLXGeneration({
    model: 'llama-3.1b-instruct-4bit',
  })

  const [prompt, setPrompt] = useState('Why is the sky blue?')
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'
  const bgColor = colorScheme === 'dark' ? 'black' : 'white'
  const [messages, setMessages] = useState<Message[]>([])
  const [disableScrollOnSizeChange, setDisableScrollOnSizeChange] = useState(false)
  const listRef = useRef<LegendListRef>(null)
  const inputRef = useRef<TextInput>(null)

  const sendPrompt = async () => {
    if (isLoading || isGenerating) return

    // Add user message
    const id = Crypto.randomUUID()
    const message = { id, content: prompt, isUser: true }
    setPrompt('')
    inputRef.current?.blur()
    setMessages(prevMessages => [...prevMessages, message])

    try {
      // Start generation with the new API
      const result = await generate(prompt)

      // Add AI response message after generation is complete
      if (result?.trim()) {
        console.log('here, will set messages')

        setMessages(prevMessages => [
          ...prevMessages,
          { id: Crypto.randomUUID(), content: result.trim(), isUser: false },
        ])
      }
    } catch (err) {
      console.log('error from here', err)

      // Don't show abort errors to the user, as this is expected behavior
      if (err instanceof Error && err.message === 'Generation aborted') {
        console.log('Generation was cancelled by user')
      } else {
        console.error('Generation error:', err)
      }
    }
  }

  const handleCancel = () => {
    if (isGenerating) {
      abort()
    }
  }

  // Watch for generation completion and update messages
  useEffect(() => {
    // When generation completes and we have text
    if (!isGenerating && text.trim() && messages.length > 0) {
      // Check if the last message was from the user (not the model)
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.isUser) {
        console.log('Generation complete, adding AI response to messages')
        setMessages(prevMessages => [
          ...prevMessages,
          { id: Crypto.randomUUID(), content: text.trim(), isUser: false },
        ])
      }
    }
  }, [isGenerating, text, messages])

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
          keyExtractor={item => item.id}
          estimatedItemSize={300}
          renderItem={({ item }) => <MessageItem key={item.id} {...item} />}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainScrollAtEndThreshold={1}
          onContentSizeChange={() => {
            if (isGenerating || (messages.length > 0 && !disableScrollOnSizeChange)) {
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
            if (!isGenerating) return <View />
            return (
              <View>
                <MessageItem
                  id={Crypto.randomUUID()}
                  content={text.trim()}
                  isUser={false}
                />
                <View style={{ height: 30 }} />
              </View>
            )
          }}
        />

        {!isLoading && (
          <View style={styles.inputContainer}>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter your prompt"
              ref={inputRef}
              style={[styles.textInput, { color: textColor }]}
              editable={!isGenerating}
            />
            {isGenerating ? (
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={sendPrompt} style={styles.sendButton}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#c4c4c62f',
    borderRadius: 10,
    width: '100%',
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#c4c4c62f',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ff5252',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#c4c4c62f',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
})
