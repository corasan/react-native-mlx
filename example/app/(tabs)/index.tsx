import { Text, View } from '@/components/Themed'
import { LegendList } from '@legendapp/list'
import * as Crypto from 'expo-crypto'
import { useEffect, useId, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import { MLX } from 'react-native-mlx'

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
        <Text style={{ color: textColor }}>{content}</Text>
      </View>
    )
  }
  return (
    <View style={styles.message}>
      <Text style={{ color: textColor }}>{content}</Text>
    </View>
  )
}

export default function TabOneScreen() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [tokens, setTokens] = useState<string[]>([])
  const colorScheme = useColorScheme()
  const textColor = colorScheme === 'dark' ? 'white' : 'black'
  const [messages, setMessages] = useState<Message[]>([])

  const sendPrompt = async () => {
    if (!modelLoaded) return
    const id = Crypto.randomUUID()
    const message = { id, content: prompt, isUser: true }
    setMessages(prevMessages => [...prevMessages, message])
    await MLX.generate(prompt)
  }

  useEffect(() => {
    const loadModel = async () => {
      await MLX.load('llama-3.1b-instruct-4bit')
      setModelLoaded(true)
    }
    loadModel()

    MLX.addEventListener('onTokenGeneration', token => {
      setTokens(prevTokens => [...prevTokens, token])
    })
  }, [])

  return (
    <>
      <LegendList
        data={messages}
        keyExtractor={(i, k) => k.toString()}
        estimatedItemSize={40}
        renderItem={({ item }) => <MessageItem key={item.id} {...item} />}
        alignItemsAtEnd
        ListFooterComponent={() => (
          <MessageItem
            id={Crypto.randomUUID()}
            content={tokens.join('').trim()}
            isUser={false}
          />
        )}
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
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              flex: 1,
              fontSize: 18,
              padding: 10,
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
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
