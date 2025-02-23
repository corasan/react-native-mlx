import { type HybridObject } from 'react-native-nitro-modules'

interface ModelState {
  isLoaded: boolean;
  isGenerating: boolean;
  modelId: string;
  error?: string;
  modelInfo: string;
}

export interface MLX extends HybridObject<{ ios: 'swift' }> {
  // Methods
  load(modelId: string): Promise<void>
  generate(prompt: string): Promise<void>

  // Properties
  output: string
  tokensPerSecond: number
  downloadProgress: number
  currentFile: string
  error: string
  state: ModelState

  listenToTokenGeneration(listener: (token: string) => void): void
}
