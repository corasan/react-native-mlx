import { NitroModules } from 'react-native-nitro-modules'
import type { ModelManager as ModelManagerSpec } from './specs/ModelManager.nitro'

let instance: ModelManagerSpec | null = null

function getInstance(): ModelManagerSpec {
  if (!instance) {
    instance = NitroModules.createHybridObject<ModelManagerSpec>('ModelManager')
  }
  return instance
}

export const ModelManager = {
  download(
    modelId: string,
    progressCallback: (progress: number) => void
  ): Promise<string> {
    return getInstance().download(modelId, progressCallback)
  },

  isDownloaded(modelId: string): Promise<boolean> {
    return getInstance().isDownloaded(modelId)
  },

  getDownloadedModels(): Promise<string[]> {
    return getInstance().getDownloadedModels()
  },

  deleteModel(modelId: string): Promise<void> {
    return getInstance().deleteModel(modelId)
  },

  getModelPath(modelId: string): Promise<string> {
    return getInstance().getModelPath(modelId)
  },

  get debug(): boolean {
    return getInstance().debug
  },

  set debug(value: boolean) {
    getInstance().debug = value
  },
}
