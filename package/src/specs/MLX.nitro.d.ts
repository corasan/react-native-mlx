import type { AnyMap, HybridObject } from 'react-native-nitro-modules';
import type { ModelState, RNMLXEventTypes } from './RNMLXEventType';
export interface MLX extends HybridObject<{
    ios: 'swift';
}> {
    /**
     * Loads model with given id
     * @param modelId
    */
    load(modelId: string): Promise<void>;
    generate(prompt: string): Promise<void>;
    /**
    * Adds event listener to listener to different events sent over by the native code
    * @param eventType
    * @param listener
    */
    addEventListener(eventType: RNMLXEventTypes, listener: (payload: AnyMap) => void): string;
    /**
    * Removes event listener by id
    * @param listenerId
    */
    removeEventListener(listenerId: string): void;
    response: string;
    tokensPerSecond: number;
    downloadProgress: number;
    currentFile: string;
    error: string;
    state: ModelState;
}
