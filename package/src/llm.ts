import { NitroModules } from 'react-native-nitro-modules'
import type { LLM as LLMSpec, GenerationStats } from './specs/LLM.nitro'

let instance: LLMSpec | null = null

function getInstance(): LLMSpec {
  if (!instance) {
    instance = NitroModules.createHybridObject<LLMSpec>('LLM')
  }
  return instance
}

export const LLM = {
  load(modelId: string, onProgress: (progress: number) => void): Promise<void> {
    return getInstance().load(modelId, onProgress)
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

  getLastGenerationStats(): GenerationStats {
    return getInstance().getLastGenerationStats()
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

  get systemPrompt(): string {
    return getInstance().systemPrompt
  },

  set systemPrompt(value: string) {
    getInstance().systemPrompt = value
  },
}
