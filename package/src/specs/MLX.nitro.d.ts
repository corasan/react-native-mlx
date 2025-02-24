import { type HybridObject } from 'react-native-nitro-modules';
import { type EventPayloadMap, type ModelState, RNMLXEventTypes } from './RNMLXEventType';
export interface MLX extends HybridObject<{
    ios: 'swift';
}> {
    load(modelId: string): Promise<void>;
    generate(prompt: string): Promise<void>;
    addEventListener(eventType: string, listener: (payload: EventPayloadMap[keyof typeof RNMLXEventTypes]) => void): string;
    removeEventListener(eventType: string, listenerId: string): void;
    response: string;
    tokensPerSecond: number;
    downloadProgress: number;
    currentFile: string;
    error: string;
    state: ModelState;
}
