import type { HybridObject } from 'react-native-nitro-modules'

export interface ModelManager extends HybridObject<{ ios: 'swift' }> {
  download(modelId: string, progressCallback: (progress: number) => void): Promise<string>
  isDownloaded(modelId: string): Promise<boolean>
  getDownloadedModels(): Promise<string[]>
  deleteModel(modelId: string): Promise<void>
  getModelPath(modelId: string): Promise<string>

  debug: boolean
}
