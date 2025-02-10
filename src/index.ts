import { NitroModules } from 'react-native-nitro-modules'
import type { Mlx as MlxSpec } from './specs/mlx.nitro'

export const Mlx =
  NitroModules.createHybridObject<MlxSpec>('Mlx')