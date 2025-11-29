import Foundation
import NitroModules
internal import MLX
internal import MLXLLM
internal import MLXLMCommon

class HybridLLM: HybridLLMSpec {
    private var session: ChatSession?
    private var currentTask: Task<String, Error>?
    private var eventListeners: [String: (eventType: LLMEvents, listener: (String) -> Void)] = [:]

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
                var result = ""
                for try await chunk in session.streamResponse(to: prompt) {
                    if Task.isCancelled { break }
                    result += chunk
                    self.emitEvent(.ontoken, payload: chunk)
                }
                self.emitEvent(.oncomplete, payload: result)
                return result
            }

            self.currentTask = task

            do {
                let result = try await task.value
                self.currentTask = nil
                return result
            } catch {
                self.currentTask = nil
                self.emitEvent(.onerror, payload: error.localizedDescription)
                throw error
            }
        }
    }

    func stop() throws {
        currentTask?.cancel()
        currentTask = nil
    }

    func addEventListener(eventType: LLMEvents, listener: @escaping (String) -> Void) throws -> String {
        let listenerId = UUID().uuidString
        eventListeners[listenerId] = (eventType: eventType, listener: listener)
        return listenerId
    }

    func removeEventListener(listenerId: String) throws {
        eventListeners.removeValue(forKey: listenerId)
    }

    private func emitEvent(_ eventType: LLMEvents, payload: String) {
        for (_, listenerInfo) in eventListeners where listenerInfo.eventType == eventType {
            listenerInfo.listener(payload)
        }
    }
}
