import { type EnhancedEventPayload, type EventTypes, type ModelState } from './specs/RNMLXEventType';
export declare class MLXDefault {
    response: string;
    isGenerating: boolean;
    state: ModelState;
    constructor();
    load(modelId: string): Promise<void>;
    generate(prompt: string): Promise<void>;
    addEventListener<T extends EventTypes>(eventType: T, listener: (payload: EnhancedEventPayload[T]) => void): string;
}
export declare const MLX: MLXDefault;
export type { EventTypes, ModelState };
