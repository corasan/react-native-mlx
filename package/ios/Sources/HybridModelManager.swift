import Foundation
import NitroModules
internal import MLXLMCommon
internal import MLXLLM

class HybridModelManager: HybridModelManagerSpec {
    private let fileManager = FileManager.default

    func download(
        modelId: String,
        progressCallback: @escaping (Double) -> Void
    ) throws -> Promise<String> {
        return Promise.async {
            print("[ModelManager] Starting download for: \(modelId)")

            let modelDir = try await ModelDownloader.shared.download(
                modelId: modelId,
                progressCallback: progressCallback
            )

            print("[ModelManager] Download complete: \(modelDir.path)")
            return modelDir.path
        }
    }

    func isDownloaded(modelId: String) throws -> Promise<Bool> {
        return Promise.async {
            return await ModelDownloader.shared.isDownloaded(modelId: modelId)
        }
    }

    func getDownloadedModels() throws -> Promise<[String]> {
        return Promise.async { [self] in
            let docsDir = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let modelsDir = docsDir.appendingPathComponent("huggingface/models")

            guard fileManager.fileExists(atPath: modelsDir.path) else {
                return []
            }

            let contents = try fileManager.contentsOfDirectory(
                at: modelsDir,
                includingPropertiesForKeys: [.isDirectoryKey]
            )

            return contents
                .filter { url in
                    var isDir: ObjCBool = false
                    return fileManager.fileExists(atPath: url.path, isDirectory: &isDir) && isDir.boolValue
                }
                .map { $0.lastPathComponent.replacingOccurrences(of: "_", with: "/") }
        }
    }

    func deleteModel(modelId: String) throws -> Promise<Void> {
        return Promise.async {
            try await ModelDownloader.shared.deleteModel(modelId: modelId)
        }
    }

    func getModelPath(modelId: String) throws -> Promise<String> {
        return Promise.async {
            return await ModelDownloader.shared.getModelDirectory(modelId: modelId).path
        }
    }
}
