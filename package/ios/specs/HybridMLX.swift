import Foundation
import NitroModules

@MainActor
class HybridMLX: HybridMLXSpec {
    private var llm = LLMEvaluator()

    var listeners: [(String) -> Void] = []
    var output: String = ""
    var tokensPerSecond: Double = 0
    var downloadProgress: Double = 0
    var currentFile: String = ""
    var error: String = ""
    var state = ModelState(
        isLoaded: false,
        isGenerating: false,
        modelId: "",
        error: nil,
        modelInfo: ""
    )
    
    func listenToTokenGeneration(listener: @escaping (String) -> Void) {
        listeners.append(listener)
    }

    func load(modelId: String) -> Promise<Void> {
        self.llm.progressHandler = { [weak self] progress, file in
            guard let self else { return }
            Task { @MainActor in
                self.downloadProgress = progress
                self.currentFile = file
            }
            
        }
        return Promise.async {
            do {
                _ = try await self.llm.load()
                self.state = ModelState(
                    isLoaded: true,
                    isGenerating: false,
                    modelId: modelId,
                    error: nil,
                    modelInfo: self.llm.modelInfo
                )
            } catch {
                self.state = ModelState(
                    isLoaded: false,
                    isGenerating: false,
                    modelId: modelId,
                    error: error.localizedDescription,
                    modelInfo: ""
                )
                throw error
            }
        }
    }
    
    func generate(prompt: String) -> Promise<Void> {
        return Promise.async {
            self.state.isGenerating = true
            self.llm.generationHandler = { [weak self] text, tokensPerSecond in
                guard let self else { return }
                Task { @MainActor in
                    self.output = text
                    self.tokensPerSecond = tokensPerSecond
                    for listener in self.listeners {
                        listener(text)
                    }
                }
            }
            await self.llm.generate(prompt: prompt)
            self.state.isGenerating = false
        }
    }
}
