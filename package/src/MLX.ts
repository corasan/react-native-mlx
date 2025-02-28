import { type AnyMap, NitroModules } from 'react-native-nitro-modules';
import type { MLX as MLXType } from './specs/MLX.nitro';
import { type EnhancedEventPayload, type EventTypes, type ModelState, RNMLXEventTypes } from './specs/RNMLXEventType'

export interface MLXOptions {
  model: string;
  context?: string;
  systemPrompt?: string;
}

const MLXBase = NitroModules.createHybridObject<MLXType>('MLX');

const eventTypeToEnum: Record<string, number> = {
  onTokenGeneration: RNMLXEventTypes.onTokenGeneration,
  onModelLoadProgress: RNMLXEventTypes.onModelLoadProgress,
  onStateChange: RNMLXEventTypes.onStateChange,
  onError: RNMLXEventTypes.onError,
  onGenerationComplete: RNMLXEventTypes.onGenerationComplete,
};

export class MLX {
  response = ''
  state: ModelState = { isGenerating: false, isLoaded: false, modelId: '', modelInfo: '' }
  isGenerating = false
  isLoaded = false

  constructor() {
    this._setupDefaultListeners()
  }

  private _setupDefaultListeners() {
    // Set up default listeners to update internal state
    this.addEventListener('onTokenGeneration', () => { })
    this.addEventListener('onStateChange', () => { })
  }

  async load(options: MLXOptions | string) {
    let modelId: string

    if (typeof options === 'string') {
      modelId = options
    } else {
      modelId = options.model
      // Future enhancement: handle context and systemPrompt
    }

    await MLXBase.load(modelId)
  }

  async generate(prompt: string): Promise<string> {
    await MLXBase.generate(prompt)
    return this.response
  }

  addEventListener<T extends EventTypes>(
    eventType: T,
    listener: (payload: EnhancedEventPayload[T]) => void,
  ): string {
    const eventTypeString = String(eventType)
    const enumValue = eventTypeToEnum[eventTypeString]

    if (enumValue === undefined) {
      throw new Error(`Unknown event type: ${String(eventType)}`)
    }

    if (eventType === 'onTokenGeneration') {
      return MLXBase.addEventListener(enumValue, payload => {
        this.response = payload.text as unknown as string
        listener(payload as unknown as EnhancedEventPayload[T])
      })
    }
    if (eventType === 'onStateChange') {
      return MLXBase.addEventListener(enumValue, (payload) => {
        const p = payload as unknown as EnhancedEventPayload['onStateChange']
        this.state = p
        this.isGenerating = p.isGenerating
        this.isLoaded = p.isLoaded
        listener(payload as unknown as EnhancedEventPayload[T])
      })
    }

    return MLXBase.addEventListener(enumValue, listener as (p: AnyMap) => void)
  }

  removeEventListener(listenerId: string) {
    MLXBase.removeEventListener(listenerId)
  }
}
