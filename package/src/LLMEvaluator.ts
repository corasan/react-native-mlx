import { type AnyMap, NitroModules } from 'react-native-nitro-modules';
import type { LLMEvaluator as LLMEvaluatorSpec } from './specs/LLMEvaluator.nitro';
import { type EnhancedEventPayload, type EventTypes, LLMEvaluatorEventTypes, type ModelState } from './specs/LLMEvaluatorEventType'

export interface MLXOptions {
  model: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export type GenerationCallbacks = {
  onToken?: (token: string, fullText: string) => void;
  onComplete?: (response: { text: string; tokensPerSecond: number }) => void;
  onError?: (error: Error) => void;
}

const LLMEvaluatorSpecBase = NitroModules.createHybridObject<LLMEvaluatorSpec>('LLMEvaluator');

const eventTypeToEnum: Record<string, number> = {
  onTokenGeneration: LLMEvaluatorEventTypes.onTokenGeneration,
  onModelLoadProgress: LLMEvaluatorEventTypes.onModelLoadProgress,
  onStateChange: LLMEvaluatorEventTypes.onStateChange,
  onError: LLMEvaluatorEventTypes.onError,
  onGenerationComplete: LLMEvaluatorEventTypes.onGenerationComplete,
};

/**
 * Result of a model generation operation
 */
export interface GenerationResult {
  text: string;
  tokensPerSecond?: number;
}

/**
 * Options for model generation
 */
export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export class LLMEvaluator {
  response = ''
  state: ModelState = { isGenerating: false, isLoaded: false, modelId: '', modelInfo: '' }
  isGenerating = false
  isLoaded = false
  private abortController?: AbortController

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

  /**
   * Generate a response from the model (basic API)
   * @param prompt The input prompt to generate from
   * @returns A promise that resolves to the generated text
   */
  async generate(prompt: string): Promise<string> {
    await LLMEvaluatorSpecBase.generate(prompt)
    return this.response
  }
  
  /**
   * Generate a response with detailed control and streaming capabilities
   * @param prompt The input prompt to generate from
   * @param callbacks Optional callbacks for streaming tokens and completion
   * @returns A promise that resolves to the final generation result
   */
  /**
   * Generate a response with detailed control and streaming capabilities
   * @param prompt The input prompt to generate from
   * @param callbacks Optional callbacks for streaming tokens and completion
   * @param options Optional generation parameters
   * @returns A promise that resolves to the final generation result
   */
  async generateWithCallbacks(
    prompt: string, 
    callbacks?: GenerationCallbacks,
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    // Track any listeners we need to clean up
    const listenerIds: string[] = []
    
    // Support for cancellation
    if (this.abortController) {
      // Cancel any existing generation
      this.abortController.abort()
    }
    
    // Create new abort controller or use the one from options
    let localAbortController: AbortController | undefined
    if (!options?.signal) {
      localAbortController = new AbortController()
      this.abortController = localAbortController
    }
    
    const signal = options?.signal || localAbortController?.signal
    
    // Create a promise that will resolve when generation is complete
    return new Promise((resolve, reject) => {
      // Set up abort handler
      if (signal) {
        signal.addEventListener('abort', () => {
          // TODO: Call native abort method when implemented
          // Clean up listeners
          listenerIds.forEach(id => this.removeEventListener(id))
          reject(new Error('Generation aborted'))
        }, { once: true })
      }
      
      // Set up token listener if needed
      if (callbacks?.onToken) {
        const tokenListener = this.addEventListener('onTokenGeneration', (payload) => {
          callbacks.onToken?.(payload.text, this.response)
        })
        listenerIds.push(tokenListener)
      }
      
      // Set up completion listener
      const completeListener = this.addEventListener('onGenerationComplete', (payload) => {
        // Clean up all listeners
        listenerIds.forEach(id => this.removeEventListener(id))
        
        // Clear abort controller reference
        if (localAbortController === this.abortController) {
          this.abortController = undefined
        }
        
        const result = { 
          text: this.response,
          tokensPerSecond: payload.tokensPerSecond
        }
        
        callbacks?.onComplete?.(result)
        resolve(result)
      })
      listenerIds.push(completeListener)
      
      // Set up error listener
      const errorListener = this.addEventListener('onError', (payload) => {
        // Clean up all listeners
        listenerIds.forEach(id => this.removeEventListener(id))
        
        // Clear abort controller reference
        if (localAbortController === this.abortController) {
          this.abortController = undefined
        }
        
        const error = new Error(payload.error)
        callbacks?.onError?.(error)
        reject(error)
      })
      listenerIds.push(errorListener)
      
      // Start generation
      LLMEvaluatorSpecBase.generate(prompt).catch(error => {
        // Clean up all listeners on error
        listenerIds.forEach(id => this.removeEventListener(id))
        
        // Clear abort controller reference
        if (localAbortController === this.abortController) {
          this.abortController = undefined
        }
        
        reject(error)
      })
    })
  }
  
  /**
   * Abort the current generation
   */
  abort() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = undefined
    }
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
