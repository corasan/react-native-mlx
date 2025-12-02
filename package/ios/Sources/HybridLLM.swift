import Foundation
import NitroModules
internal import MLX
internal import MLXLLM
internal import MLXLMCommon

class HybridLLM: HybridLLMSpec {
    private var session: ChatSession?
    private var currentTask: Task<String, Error>?
    private var lastStats: GenerationStats = GenerationStats(
        tokenCount: 0,
        tokensPerSecond: 0,
        timeToFirstToken: 0,
        totalTime: 0
    )
    private var modelFactory: ModelFactory = LLMModelFactory.shared

    var isLoaded: Bool { session != nil }
    var isGenerating: Bool { currentTask != nil }
    var modelId: String = ""
    var debug: Bool = false
    var systemPrompt: String = "You are a helpful assistant."
    var additionalContext: LLMMessage = LLMMessage()

    private func log(_ message: String) {
        if debug {
            print("[MLXReactNative.HybridLLM] \(message)")
        }
    }

    func load(modelId: String, options: LLMLoadOptions?) throws -> Promise<Void> {
        return Promise.async { [self] in
            let modelDir = await ModelDownloader.shared.getModelDirectory(modelId: modelId)
            log("Loading from directory: \(modelDir.path)")

            let config = ModelConfiguration(directory: modelDir)
            let container = try await modelFactory.loadContainer(
                configuration: config
            ) { progress in
                options?.onProgress?(progress.fractionCompleted)
            }

            // Convert [LLMMessage]? to [String: Any]?
            let additionalContextDict: [String: Any]? = if let messages = options?.additionalContext {
                ["messages": messages.map { ["role": $0.role, "content": $0.content] }]
            } else {
                nil
            }

            self.session = ChatSession(container, instructions: self.systemPrompt, additionalContext: additionalContextDict)
            self.modelId = modelId
            log("Model loaded with system prompt: \(self.systemPrompt.prefix(50))...")
        }
    }

    func generate(prompt: String) throws -> Promise<String> {
        guard let session = session else {
            throw LLMError.notLoaded
        }

        return Promise.async { [self] in
            let task = Task<String, Error> {
                log("Generating response for: \(prompt.prefix(50))...")
                let result = try await session.respond(to: prompt)
                log("Generation complete")
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
                var tokenCount = 0
                let startTime = Date()
                var firstTokenTime: Date?

                log("Streaming response for: \(prompt.prefix(50))...")
                for try await chunk in session.streamResponse(to: prompt) {
                    if Task.isCancelled { break }

                    if firstTokenTime == nil {
                        firstTokenTime = Date()
                    }
                    tokenCount += 1
                    result += chunk
                    onToken(chunk)
                }

                let endTime = Date()
                let totalTime = endTime.timeIntervalSince(startTime) * 1000
                let timeToFirstToken = (firstTokenTime ?? endTime).timeIntervalSince(startTime) * 1000
                let tokensPerSecond = totalTime > 0 ? Double(tokenCount) / (totalTime / 1000) : 0

                self.lastStats = GenerationStats(
                    tokenCount: Double(tokenCount),
                    tokensPerSecond: tokensPerSecond,
                    timeToFirstToken: timeToFirstToken,
                    totalTime: totalTime
                )

                log("Stream complete - \(tokenCount) tokens, \(String(format: "%.1f", tokensPerSecond)) tokens/s")
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

    func getLastGenerationStats() throws -> GenerationStats {
        return lastStats
    }
}
