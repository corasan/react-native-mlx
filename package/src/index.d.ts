import { type EnhancedEventPayload, type EventTypes, type ModelState } from './specs/RNMLXEventType';
export declare class MLX {
    response: string;
    state: ModelState;
    isGenerating: boolean;
    isLoaded: boolean;
    load(modelId: string): Promise<void>;
    generate(prompt: string): Promise<void>;
    addEventListener<T extends EventTypes>(eventType: T, listener: (payload: EnhancedEventPayload[T]) => void): string;
    removeEventListener(listenerId: string): void;
}
export declare const llm: MLX;
export type { EventTypes, ModelState };
