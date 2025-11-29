import { NitroModules } from 'react-native-nitro-modules'
import type { LLM } from './specs/LLM.nitro'
import { LLMEvents, type ModelState } from './specs/LLMEvents'

export { LLMEvents }
export type { LLM, ModelState }

export function createLLM(): LLM {
  return NitroModules.createHybridObject<LLM>('LLM')
}
