import { type HybridObject } from 'react-native-nitro-modules'
import { type EventPayloadMap, type ModelState, RNMLXEventTypes } from './RNMLXEventType'

export interface MLX extends HybridObject<{ ios: 'swift' }> {
  // Methods
  load(modelId: string): Promise<void>
  generate(prompt: string): Promise<void>
  addEventListener(eventType: RNMLXEventTypes, listener: (payload: EventPayloadMap[keyof typeof RNMLXEventTypes]) => void): string
  removeEventListener(eventType: RNMLXEventTypes): void

  // Properties
  response: string
  tokensPerSecond: number
  downloadProgress: number
  currentFile: string
  error: string
  state: ModelState
}
