import { NitroModules } from 'react-native-nitro-modules'
import type { LLM } from './specs/LLM.nitro'
import type { ModelManager } from './specs/ModelManager.nitro'
import { LLMEvents, type ModelState } from './specs/LLMEvents'

export { LLMEvents }
export type { LLM, ModelManager, ModelState }

export function createLLM(): LLM {
  return NitroModules.createHybridObject<LLM>('LLM')
}

export function createModelManager(): ModelManager {
  return NitroModules.createHybridObject<ModelManager>('ModelManager')
}
