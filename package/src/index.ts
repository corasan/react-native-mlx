import { NitroModules } from 'react-native-nitro-modules'
import type { LLM } from './specs/LLM.nitro'
import type { ModelManager } from './specs/ModelManager.nitro'

export type { LLM, ModelManager }

export function createLLM(): LLM {
  return NitroModules.createHybridObject<LLM>('LLM')
}

export function createModelManager(): ModelManager {
  return NitroModules.createHybridObject<ModelManager>('ModelManager')
}
