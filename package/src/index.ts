import { NitroModules } from 'react-native-nitro-modules'
import type { MLX as MLXSpec } from './specs/MLX.nitro'

interface MLX extends MLXSpec {
  // Add your custom methods and properties here
}

export const MLX =
  NitroModules.createHybridObject<MLXSpec>('MLX')
