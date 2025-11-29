export enum LLMEvents {
  onToken = 0,
  onComplete = 1,
  onError = 2,
}

export interface ModelState {
  isLoaded: boolean
  isGenerating: boolean
  modelId: string
  error?: string
}
