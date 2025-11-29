import type { HybridObject } from 'react-native-nitro-modules'
import type { LLMEvents } from './LLMEvents'

export interface LLM extends HybridObject<{ ios: 'swift' }> {
  load(modelId: string): Promise<void>
  generate(prompt: string): Promise<string>
  stop(): void

  readonly isLoaded: boolean
  readonly isGenerating: boolean
  readonly modelId: string

  addEventListener(
    eventType: LLMEvents,
    listener: (payload: string) => void
  ): string
  removeEventListener(listenerId: string): void
}
