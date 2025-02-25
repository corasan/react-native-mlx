import { NitroModules } from 'react-native-nitro-modules';
import type { MLX as MLXType } from './specs/MLX.nitro';
import { type EnhancedEventPayload, RNMLXEventTypes, type EventTypes, type ModelState } from './specs/RNMLXEventType';

const MLXBase = NitroModules.createHybridObject<MLXType>('MLX');

const eventTypeToEnum: Record<string, number> = {
  onTokenGeneration: RNMLXEventTypes.onTokenGeneration,
  onModelLoadProgress: RNMLXEventTypes.onModelLoadProgress,
  onStateChange: RNMLXEventTypes.onStateChange,
  onError: RNMLXEventTypes.onError,
  onGenerationComplete: RNMLXEventTypes.onGenerationComplete,
};

export class MLX {
  response = '';
  state: ModelState = { isGenerating: false, isLoaded: false, 'modelId': '', 'modelInfo': '' };

  async load(modelId: string) {
    await MLXBase.load(modelId)
  }

  async generate(prompt: string) {
    return MLXBase.generate(prompt);
  }

  addEventListener<T extends EventTypes>(
    eventType: T,
    listener: (payload: EnhancedEventPayload[T]) => void
  ): string {
    const eventTypeString = String(eventType);
    const enumValue = eventTypeToEnum[eventTypeString];

    if (enumValue === undefined) {
      throw new Error(`Unknown event type: ${String(eventType)}`);
    }

    if (eventType === 'onTokenGeneration') {
      return MLXBase.addEventListener(enumValue, (payload) => {
        this.response = payload.text as any
        listener(payload as any);
      })
    }
    if (eventType === 'onStateChange') {
      return MLXBase.addEventListener(enumValue, (payload) => {
        this.state = payload.state as any
        listener(payload as any);
      })
    }

    return MLXBase.addEventListener(enumValue, listener as any);
  }
}

export const llm = new MLX()

export type { EventTypes, ModelState };
