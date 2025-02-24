export interface ModelState {
  isLoaded: boolean;
  isGenerating: boolean;
  modelId: string;
  error?: string;
  modelInfo: string;
}

export enum RNMLXEventTypes {
  onTokenGeneration,
  onModelLoadProgress,
  onStateChange,
  onError,
  onGenerationComplete,
}

export interface TokenGenerationEvent {
  type: RNMLXEventTypes;
  text: string;
}

export interface ModelLoadProgressEvent {
  type: RNMLXEventTypes;
  progress: number;
  file: string;
}

export interface StateChangeEvent {
  type: RNMLXEventTypes;
  state: ModelState;
}

export interface ErrorEvent {
  type: RNMLXEventTypes;
  message: string;
}

export interface GenerationCompleteEvent {
  type: RNMLXEventTypes;
  tokensPerSecond: number;
}

export type RNMLXEventType =
  | TokenGenerationEvent
  | ModelLoadProgressEvent
  | StateChangeEvent
  | ErrorEvent
  | GenerationCompleteEvent;
