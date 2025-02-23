import { Text, View } from '@/components/Themed'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { MLX } from 'react-native-mlx'

export default function TabOneScreen() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [tokens, setTokens] = useState<string[]>([])

  useEffect(() => {
    const loadModel = async () => {
      await MLX.load('llama-3.1b-instruct-4bit')
      setModelLoaded(true)
    }
    loadModel()

    MLX.listenToTokenGeneration(token => {
      setTokens(prevTokens => [...prevTokens, token])
    })
  }, [])

  return (
    <View style={styles.container}>
      {tokens.map((token, index) => (
        <Text key={index.toString()} style={{ color: 'white' }}>
          {token}
        </Text>
      ))}
      {modelLoaded && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#c4c4c62f',
            borderRadius: 10,
          }}
        >
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt"
            style={{
              flex: 1,
              color: 'white',
              padding: 10,
            }}
          />
          <TouchableOpacity onPress={() => MLX.generate(prompt)}>
            <Text
              style={{
                color: 'black',
                padding: 10,
                backgroundColor: 'white',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
})
