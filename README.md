# react-native-nitro-mlx

Run LLMs on-device in React Native using [MLX Swift](https://github.com/ml-explore/mlx-swift).

## Requirements

- iOS 26.0+

## Installation

```bash
npm install react-native-nitro-mlx react-native-nitro-modules
```

Then run pod install:

```bash
cd ios && pod install
```

## Usage

### Download a Model

```typescript
import { ModelManager } from 'react-native-nitro-mlx'

await ModelManager.download('mlx-community/Qwen3-0.6B-4bit', (progress) => {
  console.log(`Download progress: ${(progress * 100).toFixed(1)}%`)
})
```

### Load and Generate

```typescript
import { LLM } from 'react-native-nitro-mlx'

await LLM.load('mlx-community/Qwen3-0.6B-4bit', (progress) => {
  console.log(`Loading: ${(progress * 100).toFixed(0)}%`)
})

const response = await LLM.generate('What is the capital of France?')
console.log(response)
```

### Streaming

```typescript
let response = ''
await LLM.stream('Tell me a story', (token) => {
  response += token
  console.log(response)
})
```

### Stop Generation

```typescript
LLM.stop()
```

## API

### LLM

| Method | Description |
|--------|-------------|
| `load(modelId: string, onProgress: (progress: number) => void): Promise<void>` | Load a model into memory |
| `generate(prompt: string): Promise<string>` | Generate a complete response |
| `stream(prompt: string, onToken: (token: string) => void): Promise<string>` | Stream tokens as they're generated |
| `stop(): void` | Stop the current generation |

| Property | Description |
|----------|-------------|
| `isLoaded: boolean` | Whether a model is loaded |
| `isGenerating: boolean` | Whether generation is in progress |
| `modelId: string` | The currently loaded model ID |
| `debug: boolean` | Enable debug logging |

### ModelManager

| Method | Description |
|--------|-------------|
| `download(modelId: string, onProgress: (progress: number) => void): Promise<string>` | Download a model from Hugging Face |
| `isDownloaded(modelId: string): Promise<boolean>` | Check if a model is downloaded |
| `getDownloadedModels(): Promise<string[]>` | Get list of downloaded models |
| `deleteModel(modelId: string): Promise<void>` | Delete a downloaded model |
| `getModelPath(modelId: string): Promise<string>` | Get the local path of a model |

| Property | Description |
|----------|-------------|
| `debug: boolean` | Enable debug logging |

## Supported Models

Any MLX-compatible model from Hugging Face should work. Some tested models:

- `mlx-community/Qwen3-0.6B-4bit`
- `mlx-community/Llama-3.2-1B-Instruct-4bit`
- `mlx-community/Mistral-7B-Instruct-v0.3-4bit`

Browse more at [huggingface.co/mlx-community](https://huggingface.co/mlx-community).

## License

MIT
