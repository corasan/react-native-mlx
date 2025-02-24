import { type HybridObject } from 'react-native-nitro-modules'
import type { ModelState, RNMLXEventType, RNMLXEventTypes } from './RNMLXEventType'

export interface MLX extends HybridObject<{ ios: 'swift' }> {
  // Methods
  load(modelId: string): Promise<void>
  generate(prompt: string): Promise<void>
  addEventListener(eventType: RNMLXEventTypes, listener: (event: RNMLXEventType) => void): string
  removeEventListener(eventType: RNMLXEventTypes, listenerId: string): void

  // Properties
  response: string
  tokensPerSecond: number
  downloadProgress: number
  currentFile: string
  error: string
  state: ModelState
}
