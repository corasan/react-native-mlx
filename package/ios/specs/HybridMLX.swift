import Foundation
import NitroModules

typealias EventTypes = Variant_String_Double_ModelState

@MainActor
class HybridMLX: HybridMLXSpec {
    private var llm = LLMEvaluator()
    private var eventListeners: [RNMLXEventTypes: [(id: String, listener: (EventTypes) -> Void)]] = [:]
    
    var response: String = ""
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
    
    // Required by HybridObject protocol
    var memorySize: Int { return 0 }

    func load(modelId: String) -> Promise<Void> {
        setupHandlers()
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
                self.emitEvent(.onstatechange, .someStateChangeEvent(StateChangeEvent(type: .onstatechange, state: self.state)))
            } catch {
                self.state = ModelState(
                    isLoaded: false,
                    isGenerating: false,
                    modelId: modelId,
                    error: error.localizedDescription,
                    modelInfo: ""
                )
                self.emitEvent(.onerror, .someErrorEvent(ErrorEvent(type: .onerror, message: error.localizedDescription)))
                throw error
            }
        }
    }

    func generate(prompt: String) -> Promise<Void> {
        return Promise.async {
            self.state.isGenerating = true
            self.emitEvent(.onstatechange, .someStateChangeEvent(StateChangeEvent(type: .onstatechange, state: self.state)))

            await self.llm.generate(prompt: prompt)

            self.state.isGenerating = false
            self.emitEvent(.onstatechange, .someStateChangeEvent(StateChangeEvent(type: .onstatechange, state: self.state)))
        }
    }

    private func setupHandlers() {
        self.llm.progressHandler = { [weak self] progress, file in
            Task { @MainActor in
                guard let self = self else { return }
                
                let event = ModelLoadProgressEvent(type: .onmodelloadprogress, progress: progress, file: file)
                self.emitEvent(.onmodelloadprogress, .someModelLoadProgressEvent(event))
                self.downloadProgress = progress
                self.currentFile = file
            }
        }

        self.llm.generationHandler = { [weak self] text, tokensPerSecond in
            Task { @MainActor in
                guard let self = self else { return }

                if tokensPerSecond > 0 {
                    let event = GenerationCompleteEvent(type: .ongenerationcomplete, tokensPerSecond: tokensPerSecond)
                    self.emitEvent(.ongenerationcomplete, .someGenerationCompleteEvent(event))
                    self.tokensPerSecond = tokensPerSecond
                } else {
                    let event = TokenGenerationEvent(type: .ontokengeneration, text: text)
                    self.emitEvent(.ontokengeneration, .someTokenGenerationEvent(event))
                    self.response = text
                }
            }
        }
    }

    func addEventListener(eventType: RNMLXEventTypes, listener: @escaping (EventTypes) -> Void) throws -> String {
        let listenerId = UUID().uuidString
        if eventListeners[eventType] == nil {
            eventListeners[eventType] = []
        }
        eventListeners[eventType]?.append((id: listenerId, listener: listener))
        return listenerId
    }
    
    func removeEventListener(eventType: RNMLXEventTypes, listenerId: String) throws {
        eventListeners[eventType]?.removeAll { $0.id == listenerId }
    }
    
    private func emitEvent(_ type: RNMLXEventTypes, _ event: EventTypes) {
        eventListeners[type]?.forEach { $0.listener(event) }
    }
}
