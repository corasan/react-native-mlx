import type { HybridObject } from 'react-native-nitro-modules'

export interface GenerationStats {
  tokenCount: number
  tokensPerSecond: number
  timeToFirstToken: number
  totalTime: number
}

export interface LLM extends HybridObject<{ ios: 'swift' }> {
  load(modelId: string, onProgress: (progress: number) => void): Promise<void>
  generate(prompt: string): Promise<string>
  stream(prompt: string, onToken: (token: string) => void): Promise<string>
  stop(): void
  getLastGenerationStats(): GenerationStats

  readonly isLoaded: boolean
  readonly isGenerating: boolean
  readonly modelId: string

  debug: boolean
  systemPrompt: string
}
