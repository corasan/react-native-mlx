import { NitroModules } from 'react-native-nitro-modules'
import type { MLX as MLXSpec } from './specs/mlx.nitro'

export const Mlx =
  NitroModules.createHybridObject<MLXSpec>('MLX')
