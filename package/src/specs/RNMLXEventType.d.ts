export declare enum RNMLXEventTypes {
    onTokenGeneration = 0,
    onModelLoadProgress = 1,
    onStateChange = 2,
    onError = 3,
    onGenerationComplete = 4
}
export interface ModelState {
    isLoaded: boolean;
    isGenerating: boolean;
    modelId: string;
    error?: string;
    modelInfo: string;
}
export type EventPayloadMap = {
    onTokenGeneration: string;
    onModelLoadProgress: number;
    onStateChange: ModelState;
    onError: string;
    onGenerationComplete: number;
};
export type EnhancedEventPayload = {
    onTokenGeneration: {
        text: string;
        type: 'onTokenGeneration';
    };
    onModelLoadProgress: {
        progress: number;
        type: 'onModelLoadProgress';
    };
    onStateChange: ModelState & {
        type: 'onStateChange';
    };
    onError: {
        error: string;
        type: 'onError';
    };
    onGenerationComplete: {
        tokensPerSecond: number;
        type: 'onGenerationComplete';
    };
};
export interface EventPayload {
    [key: string]: any;
}
export type EventTypes = keyof typeof RNMLXEventTypes;
