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

Any MLX-compatible model from Hugging Face should work. The package exports an `MLXModel` enum with pre-defined models for convenience that are more likely to run well on-device:

```typescript
import { MLXModel } from 'react-native-nitro-mlx'

await ModelManager.download(MLXModel.Llama_3_2_1B_Instruct_4bit, (progress) => {
  console.log(`Download progress: ${(progress * 100).toFixed(1)}%`)
})
```

### Available Models

| Model | Enum Key | Hugging Face ID |
|-------|----------|-----------------|
| **Llama 3.2 (Meta)** | | |
| Llama 3.2 1B 4-bit | `Llama_3_2_1B_Instruct_4bit` | `mlx-community/Llama-3.2-1B-Instruct-4bit` |
| Llama 3.2 1B 8-bit | `Llama_3_2_1B_Instruct_8bit` | `mlx-community/Llama-3.2-1B-Instruct-8bit` |
| Llama 3.2 3B 4-bit | `Llama_3_2_3B_Instruct_4bit` | `mlx-community/Llama-3.2-3B-Instruct-4bit` |
| Llama 3.2 3B 8-bit | `Llama_3_2_3B_Instruct_8bit` | `mlx-community/Llama-3.2-3B-Instruct-8bit` |
| **Qwen 2.5 (Alibaba)** | | |
| Qwen 2.5 0.5B 4-bit | `Qwen2_5_0_5B_Instruct_4bit` | `mlx-community/Qwen2.5-0.5B-Instruct-4bit` |
| Qwen 2.5 0.5B 8-bit | `Qwen2_5_0_5B_Instruct_8bit` | `mlx-community/Qwen2.5-0.5B-Instruct-8bit` |
| Qwen 2.5 1.5B 4-bit | `Qwen2_5_1_5B_Instruct_4bit` | `mlx-community/Qwen2.5-1.5B-Instruct-4bit` |
| Qwen 2.5 1.5B 8-bit | `Qwen2_5_1_5B_Instruct_8bit` | `mlx-community/Qwen2.5-1.5B-Instruct-8bit` |
| Qwen 2.5 3B 4-bit | `Qwen2_5_3B_Instruct_4bit` | `mlx-community/Qwen2.5-3B-Instruct-4bit` |
| Qwen 2.5 3B 8-bit | `Qwen2_5_3B_Instruct_8bit` | `mlx-community/Qwen2.5-3B-Instruct-8bit` |
| **Qwen 3** | | |
| Qwen 3 1.7B 4-bit | `Qwen3_1_7B_4bit` | `mlx-community/Qwen3-1.7B-4bit` |
| Qwen 3 1.7B 8-bit | `Qwen3_1_7B_8bit` | `mlx-community/Qwen3-1.7B-8bit` |
| **Gemma 3 (Google)** | | |
| Gemma 3 1B 4-bit | `Gemma_3_1B_IT_4bit` | `mlx-community/gemma-3-1b-it-4bit` |
| Gemma 3 1B 8-bit | `Gemma_3_1B_IT_8bit` | `mlx-community/gemma-3-1b-it-8bit` |
| **Phi 3.5 Mini (Microsoft)** | | |
| Phi 3.5 Mini 4-bit | `Phi_3_5_Mini_Instruct_4bit` | `mlx-community/Phi-3.5-mini-instruct-4bit` |
| Phi 3.5 Mini 8-bit | `Phi_3_5_Mini_Instruct_8bit` | `mlx-community/Phi-3.5-mini-instruct-8bit` |
| **Phi 4 Mini (Microsoft)** | | |
| Phi 4 Mini 4-bit | `Phi_4_Mini_Instruct_4bit` | `mlx-community/Phi-4-mini-instruct-4bit` |
| Phi 4 Mini 8-bit | `Phi_4_Mini_Instruct_8bit` | `mlx-community/Phi-4-mini-instruct-8bit` |
| **SmolLM (HuggingFace)** | | |
| SmolLM 1.7B 4-bit | `SmolLM_1_7B_Instruct_4bit` | `mlx-community/SmolLM-1.7B-Instruct-4bit` |
| SmolLM 1.7B 8-bit | `SmolLM_1_7B_Instruct_8bit` | `mlx-community/SmolLM-1.7B-Instruct-8bit` |
| **SmolLM2 (HuggingFace)** | | |
| SmolLM2 1.7B 4-bit | `SmolLM2_1_7B_Instruct_4bit` | `mlx-community/SmolLM2-1.7B-Instruct-4bit` |
| SmolLM2 1.7B 8-bit | `SmolLM2_1_7B_Instruct_8bit` | `mlx-community/SmolLM2-1.7B-Instruct-8bit` |
| **OpenELM (Apple)** | | |
| OpenELM 1.1B 4-bit | `OpenELM_1_1B_4bit` | `mlx-community/OpenELM-1_1B-4bit` |
| OpenELM 1.1B 8-bit | `OpenELM_1_1B_8bit` | `mlx-community/OpenELM-1_1B-8bit` |
| OpenELM 3B 4-bit | `OpenELM_3B_4bit` | `mlx-community/OpenELM-3B-4bit` |
| OpenELM 3B 8-bit | `OpenELM_3B_8bit` | `mlx-community/OpenELM-3B-8bit` |

Browse more models at [huggingface.co/mlx-community](https://huggingface.co/mlx-community).

## License

MIT
