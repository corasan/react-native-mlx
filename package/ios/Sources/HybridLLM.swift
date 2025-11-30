import Foundation
import NitroModules
internal import MLX
internal import MLXLLM
internal import MLXLMCommon

class HybridLLM: HybridLLMSpec {
    private var session: ChatSession?
    private var currentTask: Task<String, Error>?

    var isLoaded: Bool { session != nil }
    var isGenerating: Bool { currentTask != nil }
    var modelId: String = ""

    func load(modelId: String) throws -> Promise<Void> {
        return Promise.async { [self] in
            let modelDir = await ModelDownloader.shared.getModelDirectory(modelId: modelId)
            print("[LLM] Loading from directory: \(modelDir.path)")

            let config = ModelConfiguration(directory: modelDir)
            let container = try await LLMModelFactory.shared.loadContainer(
                configuration: config
            ) { progress in
                print("[LLM] Load progress: \(progress.fractionCompleted)")
            }

            self.session = ChatSession(container)
            self.modelId = modelId
            print("[LLM] Model loaded successfully")
        }
    }

    func generate(prompt: String) throws -> Promise<String> {
        guard let session = session else {
            throw LLMError.notLoaded
        }

        return Promise.async { [self] in
            let task = Task<String, Error> {
                print("[LLM] Generating response for: \(prompt.prefix(50))...")
                let result = try await session.respond(to: prompt)
                print("[LLM] Generation complete")
                return result
            }

            self.currentTask = task

            do {
                let result = try await task.value
                self.currentTask = nil
                return result
            } catch {
                self.currentTask = nil
                throw error
            }
        }
    }

    func stream(prompt: String, onToken: @escaping (String) -> Void) throws -> Promise<String> {
        guard let session = session else {
            throw LLMError.notLoaded
        }

        return Promise.async { [self] in
            let task = Task<String, Error> {
                var result = ""
                print("[LLM] Streaming response for: \(prompt.prefix(50))...")
                for try await chunk in session.streamResponse(to: prompt) {
                    if Task.isCancelled { break }
                    result += chunk
                    onToken(chunk)
                }
                print("[LLM] Stream complete")
                return result
            }

            self.currentTask = task

            do {
                let result = try await task.value
                self.currentTask = nil
                return result
            } catch {
                self.currentTask = nil
                throw error
            }
        }
    }

    func stop() throws {
        currentTask?.cancel()
        currentTask = nil
    }
}
