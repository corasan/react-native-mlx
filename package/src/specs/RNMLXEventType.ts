// Keep the numeric enum and ensure it's strongly typed
export enum RNMLXEventTypes {
  onTokenGeneration,
  onModelLoadProgress,
  onStateChange,
  onError,
  onGenerationComplete,
}

export interface ModelState {
  isLoaded: boolean;
  isGenerating: boolean;
  modelId: string;
  error?: string;
  modelInfo: string;
}

// Event payload types
export type EventPayloadMap = {
  onTokenGeneration: string;
  onModelLoadProgress: number;
  onStateChange: ModelState;
  onError: string;
  onGenerationComplete: number;
}

export type EventTypes = keyof typeof RNMLXEventTypes;
