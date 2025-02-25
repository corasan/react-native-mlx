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
export class MLXDefault {
    response = '';
    isGenerating = false;
    state = { isGenerating: false, isLoaded: false, 'modelId': '', 'modelInfo': '' };
    constructor() {
        this.addEventListener('onTokenGeneration', (payload) => {
            this.response = payload.text;
        });
        this.addEventListener('onStateChange', (payload) => {
            this.state = payload.state;
            this.isGenerating = payload.state.isGenerating;
        });
    }
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
        // if (eventType === 'onTokenGeneration') {
        //   return MLXBase.addEventListener(enumValue, (payload) => {
        //     listener(payload as any);
        //   })
        // }
        // if (eventType === 'onStateChange') {
        //   return MLXBase.addEventListener(enumValue, (payload) => {
        //     listener(payload as any);
        //   })
        // }
        return MLXBase.addEventListener(enumValue, listener);
    }
}
export const MLX = new MLXDefault();
