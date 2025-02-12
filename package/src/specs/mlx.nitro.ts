import type { HybridObject } from 'react-native-nitro-modules'

export interface RNMLX extends HybridObject<{ ios: 'swift' }> {
  sum(str1: string, str2: string): string
}
