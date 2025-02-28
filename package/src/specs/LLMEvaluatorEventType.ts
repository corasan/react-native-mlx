// Keep the numeric enum and ensure it's strongly typed
export enum LLMEvaluatorEventTypes {
  onTokenGeneration = 0,
  onModelLoadProgress = 1,
  onStateChange = 2,
  onError = 3,
  onGenerationComplete = 4,
}

export interface ModelState {
  isLoaded: boolean
  isGenerating: boolean
  modelId: string
  error?: string
  modelInfo: string
}

// Event payload types
export type EventPayloadMap = {
  onTokenGeneration: string
  onModelLoadProgress: number
  onStateChange: ModelState
  onError: string
  onGenerationComplete: number
}

export type EnhancedEventPayload = {
  onTokenGeneration: { text: string; type: 'onTokenGeneration' }
  onModelLoadProgress: { progress: number; type: 'onModelLoadProgress' }
  onStateChange: ModelState & { type: 'onStateChange' }
  onError: { error: string; type: 'onError' }
  onGenerationComplete: { tokensPerSecond: number; type: 'onGenerationComplete' }
}

export interface EventPayload {
  [key: string]: unknown
}

export type EventTypes = keyof typeof LLMEvaluatorEventTypes
