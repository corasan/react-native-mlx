import { NitroModules } from 'react-native-nitro-modules'
import type { LLM as LLMSpec } from './specs/LLM.nitro'

let instance: LLMSpec | null = null

function getInstance(): LLMSpec {
  if (!instance) {
    instance = NitroModules.createHybridObject<LLMSpec>('LLM')
  }
  return instance
}

export const LLM = {
  load(modelId: string): Promise<void> {
    return getInstance().load(modelId)
  },

  generate(prompt: string): Promise<string> {
    return getInstance().generate(prompt)
  },

  stream(prompt: string, onToken: (token: string) => void): Promise<string> {
    return getInstance().stream(prompt, onToken)
  },

  stop(): void {
    getInstance().stop()
  },

  get isLoaded(): boolean {
    return getInstance().isLoaded
  },

  get isGenerating(): boolean {
    return getInstance().isGenerating
  },

  get modelId(): string {
    return getInstance().modelId
  },

  get debug(): boolean {
    return getInstance().debug
  },

  set debug(value: boolean) {
    getInstance().debug = value
  },
}
