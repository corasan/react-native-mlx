import { NitroModules } from 'react-native-nitro-modules';
import type { MLX as MLXType } from './specs/MLX.nitro';
import type { EventPayloadMap, EventTypes, ModelState } from './specs/RNMLXEventType';

const MLXBase = NitroModules.createHybridObject('MLX') as MLXType;

// Create a type-safe wrapper interface
export interface TypedMLX extends Omit<MLXType, 'addEventListener'> {
  addEventListener<T extends EventTypes>(
    eventType: T,
    listener: (payload: EventPayloadMap[T]) => void
  ): string;
}

// Export the type-safe instance
export const MLX = MLXBase as TypedMLX;

export type { EventTypes, ModelState };
