import { NitroModules } from 'react-native-nitro-modules';
import { RNMLXEventTypes } from './specs/RNMLXEventType';
const MLXBase = NitroModules.createHybridObject('MLX');
const eventTypeToEnum = {
    onTokenGeneration: RNMLXEventTypes.onTokenGeneration,
    onModelLoadProgress: RNMLXEventTypes.onModelLoadProgress,
    onStateChange: RNMLXEventTypes.onStateChange,
    onError: RNMLXEventTypes.onError,
    onGenerationComplete: RNMLXEventTypes.onGenerationComplete,
};
export class MLX {
    response = '';
    state = { isGenerating: false, isLoaded: false, 'modelId': '', 'modelInfo': '' };
    isGenerating = false;
    isLoaded = false;
    async load(modelId) {
        await MLXBase.load(modelId);
    }
    async generate(prompt) {
        return MLXBase.generate(prompt);
    }
    addEventListener(eventType, listener) {
        const eventTypeString = String(eventType);
        const enumValue = eventTypeToEnum[eventTypeString];
        if (enumValue === undefined) {
            throw new Error(`Unknown event type: ${String(eventType)}`);
        }
        if (eventType === 'onTokenGeneration') {
            return MLXBase.addEventListener(enumValue, (payload) => {
                this.response = payload.text;
                listener(payload);
            });
        }
        if (eventType === 'onStateChange') {
            return MLXBase.addEventListener(enumValue, (payload) => {
                this.state = payload;
                this.isGenerating = payload.isGenerating;
                this.isLoaded = payload.isLoaded;
                listener(payload);
            });
        }
        return MLXBase.addEventListener(enumValue, listener);
    }
    removeEventListener(listenerId) {
        MLXBase.removeEventListener(listenerId);
    }
}
export const llm = new MLX();
