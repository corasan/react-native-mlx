import type { HybridObject } from 'react-native-nitro-modules'

export interface RNMLX extends HybridObject<{ ios: 'swift' }> {
  sum(num1: number, num2: number): number
}
