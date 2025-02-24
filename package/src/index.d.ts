import type { MLX as MLXType } from './specs/MLX.nitro';
import type { EventPayloadMap, EventTypes, ModelState } from './specs/RNMLXEventType';
export interface TypedMLX extends Omit<MLXType, 'addEventListener'> {
    addEventListener<T extends EventTypes>(eventType: T, listener: (payload: EventPayloadMap[T]) => void): string;
}
export declare const MLX: TypedMLX;
export type { EventTypes, ModelState };
