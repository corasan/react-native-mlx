import { type AnyMap, NitroModules } from 'react-native-nitro-modules';
import type { LLMEvaluator as LLMEvaluatorSpec } from './specs/LLMEvaluator.nitro';
import { type EnhancedEventPayload, type EventTypes, LLMEvaluatorEventTypes, type ModelState } from './specs/LLMEvaluatorEventType'

export interface MLXOptions {
  model: string;
  context?: string;
  systemPrompt?: string;
}

const LLMEvaluatorSpecBase = NitroModules.createHybridObject<LLMEvaluatorSpec>('LLMEvaluator');

const eventTypeToEnum: Record<string, number> = {
  onTokenGeneration: LLMEvaluatorEventTypes.onTokenGeneration,
  onModelLoadProgress: LLMEvaluatorEventTypes.onModelLoadProgress,
  onStateChange: LLMEvaluatorEventTypes.onStateChange,
  onError: LLMEvaluatorEventTypes.onError,
  onGenerationComplete: LLMEvaluatorEventTypes.onGenerationComplete,
};

export class LLMEvaluator {
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

    await LLMEvaluatorSpecBase.load(modelId)
  }

  async generate(prompt: string): Promise<string> {
    await LLMEvaluatorSpecBase.generate(prompt)
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
      return LLMEvaluatorSpecBase.addEventListener(enumValue, payload => {
        this.response = payload.text as unknown as string
        listener(payload as unknown as EnhancedEventPayload[T])
      })
    }
    if (eventType === 'onStateChange') {
      return LLMEvaluatorSpecBase.addEventListener(enumValue, (payload) => {
        const p = payload as unknown as EnhancedEventPayload['onStateChange']
        this.state = p
        this.isGenerating = p.isGenerating
        this.isLoaded = p.isLoaded
        listener(payload as unknown as EnhancedEventPayload[T])
      })
    }

    return LLMEvaluatorSpecBase.addEventListener(enumValue, listener as (p: AnyMap) => void)
  }

  removeEventListener(listenerId: string) {
    LLMEvaluatorSpecBase.removeEventListener(listenerId)
  }
}
