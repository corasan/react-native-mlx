import { NitroModules } from 'react-native-nitro-modules'
import type { ModelManager as ModelManagerSpec } from './specs/ModelManager.nitro'

let instance: ModelManagerSpec | null = null

function getInstance(): ModelManagerSpec {
  if (!instance) {
    instance = NitroModules.createHybridObject<ModelManagerSpec>('ModelManager')
  }
  return instance
}

/**
 * Manage MLX model downloads from HuggingFace.
 *
 * @example
 * ```ts
 * import { ModelManager } from 'react-native-mlx'
 *
 * // Download a model
 * await ModelManager.download('mlx-community/Qwen3-0.6B-4bit', progress => {
 *   console.log(`Downloading: ${(progress * 100).toFixed(0)}%`)
 * })
 *
 * // Check if downloaded
 * const isReady = await ModelManager.isDownloaded('mlx-community/Qwen3-0.6B-4bit')
 *
 * // List all downloaded models
 * const models = await ModelManager.getDownloadedModels()
 * ```
 */
export const ModelManager = {
  /**
   * Download a model from HuggingFace.
   * @param modelId - HuggingFace model ID (e.g., 'mlx-community/Qwen3-0.6B-4bit')
   * @param progressCallback - Callback invoked with download progress (0-1)
   * @returns Path to the downloaded model directory
   */
  download(
    modelId: string,
    progressCallback: (progress: number) => void,
  ): Promise<string> {
    return getInstance().download(modelId, progressCallback)
  },

  /**
   * Check if a model is already downloaded.
   * @param modelId - HuggingFace model ID
   * @returns True if the model is fully downloaded
   */
  isDownloaded(modelId: string): Promise<boolean> {
    return getInstance().isDownloaded(modelId)
  },

  /**
   * Get a list of all downloaded model IDs.
   * @returns Array of model IDs that are available locally
   */
  getDownloadedModels(): Promise<string[]> {
    return getInstance().getDownloadedModels()
  },

  /**
   * Delete a downloaded model to free up disk space.
   * @param modelId - HuggingFace model ID
   */
  deleteModel(modelId: string): Promise<void> {
    return getInstance().deleteModel(modelId)
  },

  /**
   * Get the local filesystem path for a downloaded model.
   * @param modelId - HuggingFace model ID
   * @returns Absolute path to the model directory
   */
  getModelPath(modelId: string): Promise<string> {
    return getInstance().getModelPath(modelId)
  },

  /** Enable debug logging to console */
  get debug(): boolean {
    return getInstance().debug
  },

  set debug(value: boolean) {
    getInstance().debug = value
  },
}
