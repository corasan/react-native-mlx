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
            let hub = HubApi()
            let config = ModelConfiguration(id: modelId)

            let modelDirectory = try await downloadModel(
                hub: hub,
                configuration: config
            ) { progress in
                progressCallback(progress.fractionCompleted)
            }

            return modelDirectory.path
        }
    }

    func isDownloaded(modelId: String) throws -> Promise<Bool> {
        return Promise.async { [self] in
            let config = ModelConfiguration(id: modelId)
            let modelDir = try config.modelDirectory()
            return fileManager.fileExists(atPath: modelDir.path)
        }
    }

    func getDownloadedModels() throws -> Promise<[String]> {
        return Promise.async { [self] in
            let cacheDir = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first!
            let hubCacheDir = cacheDir.appendingPathComponent("huggingface/hub")

            guard fileManager.fileExists(atPath: hubCacheDir.path) else {
                return []
            }

            let contents = try fileManager.contentsOfDirectory(
                at: hubCacheDir,
                includingPropertiesForKeys: [.isDirectoryKey]
            )

            return contents
                .filter { url in
                    var isDir: ObjCBool = false
                    return fileManager.fileExists(atPath: url.path, isDirectory: &isDir) && isDir.boolValue
                }
                .compactMap { url -> String? in
                    let name = url.lastPathComponent
                    if name.hasPrefix("models--") {
                        return name
                            .replacingOccurrences(of: "models--", with: "")
                            .replacingOccurrences(of: "--", with: "/")
                    }
                    return nil
                }
        }
    }

    func deleteModel(modelId: String) throws -> Promise<Void> {
        return Promise.async { [self] in
            let config = ModelConfiguration(id: modelId)
            let modelDir = try config.modelDirectory()

            if fileManager.fileExists(atPath: modelDir.path) {
                try fileManager.removeItem(at: modelDir)
            }
        }
    }

    func getModelPath(modelId: String) throws -> Promise<String> {
        return Promise.async {
            let config = ModelConfiguration(id: modelId)
            let modelDir = try config.modelDirectory()
            return modelDir.path
        }
    }
}
