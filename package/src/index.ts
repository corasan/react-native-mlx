import { NitroModules } from 'react-native-nitro-modules'
import type { MLX as MLXSpec } from './specs/MLX.nitro'

export const MLX =
  NitroModules.createHybridObject<MLXSpec>('MLX')
