# react-native-mlx
------------------------------------------------------------------------
## Installation

```
bun add react-native-mlx
yarn add react-native-mlx
npm install react-native-mlx
```

If you are using Expo add the plugin to your `app.json`

```json
"plugins": [
  // other plugins
  "react-native-mlx"
]
```


## Usage

#### Hooks approach

This package includes a convenient hook, simply use it like this:

```ts
const llm = useMLX({
	model: "llama-3.2",
	context: "...",
	systemPrompt: ""
})

await llm.generate(prompt)
console.log(llm.response)
```

#### Direct usage

If you want more control you can create an instance of the MLX class

```ts
const llm = new MLX()

export default function App() {
	const [text, setText] = useState('')
	const [prompt, setPrompt] = useState('')

	useEffec(() => {
		const loadLlm = async () => {
			await llm.load({ model: "llama-3.2" })
		}

		loadLlm()
	}, [])

	const generate = async () => {
		await llm.generate(prompt)
	}

	console.log(llm.response)

	return (...)
}

```
