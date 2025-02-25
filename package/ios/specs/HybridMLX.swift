import Foundation
import NitroModules

@MainActor
class HybridMLX: HybridMLXSpec {
    private var llm = LLMEvaluator()
    private var eventListeners: [String: (eventType: RNMLXEventTypes, listener: (AnyMapHolder) -> Void)] = [:]

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

    func load(modelId: String) throws -> Promise<Void> {
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
                self.emitStateChangeEvent()
            } catch {
                self.state = ModelState(
                    isLoaded: false,
                    isGenerating: false,
                    modelId: modelId,
                    error: error.localizedDescription,
                    modelInfo: ""
                )
                self.error = error.localizedDescription
                self.emitErrorEvent(error.localizedDescription)
                throw error
            }
        }
    }

    func generate(prompt: String) throws -> Promise<Void> {
        return Promise.async {
            self.state.isGenerating = true
            self.emitStateChangeEvent()

            await self.llm.generate(prompt: prompt)

            self.state.isGenerating = false
            self.emitStateChangeEvent()
        }
    }

    private func setupHandlers() {
        self.llm.progressHandler = { [weak self] progress, file in
            Task { @MainActor in
                guard let self = self else { return }
                self.downloadProgress = progress
                self.currentFile = file
                self.emitModelLoadProgressEvent(progress: progress, file: file)
            }
        }

        self.llm.generationHandler = { [weak self] text, tokensPerSecond in
            print("generationHandler -> setting generation handler")

            Task { @MainActor in
                print("generationHandler -> setting progress handler")

                guard let self = self else { return }
                print("generationHandler -> setting progress handler")

                if tokensPerSecond > 0 {
                    self.tokensPerSecond = tokensPerSecond
                    self.emitGenerationCompleteEvent(tokensPerSecond: tokensPerSecond)
                } else {
                    self.response = text
                    self.emitTokenGenerationEvent(text: text)
                }
            }
        }
    }

    func addEventListener(eventType: RNMLXEventTypes, listener: @escaping (AnyMapHolder) -> Void) throws -> String {
        let listenerId = UUID().uuidString
        self.eventListeners[listenerId] = (eventType: eventType, listener: listener)
        return listenerId
    }

    func removeEventListener(listenerId: String) throws {
        self.eventListeners.removeValue(forKey: listenerId)
    }
    
    // MARK: Private event functions
    private func emitEvent(_ eventType: RNMLXEventTypes, payload: AnyMapHolder) {
        for (_, listenerInfo) in eventListeners where listenerInfo.eventType == eventType {
            listenerInfo.listener(payload)
        }
    }

    private func emitTokenGenerationEvent(text: String) {
        let payload = AnyMapHolder()
        payload.setString(key: "text", value: text)
        payload.setString(key: "type", value: eventTypeToString(.ontokengeneration))
        emitEvent(.ontokengeneration, payload: payload)
    }
    
    private func emitModelLoadProgressEvent(progress: Double, file: String) {
        let payload = AnyMapHolder()
        payload.setDouble(key: "progress", value: progress)
        payload.setString(key: "file", value: file)
        payload.setString(key: "type", value: eventTypeToString(.onmodelloadprogress))
        emitEvent(.onmodelloadprogress, payload: payload)
    }
    
    private func emitStateChangeEvent() {
        let payload = AnyMapHolder()
        payload.setBoolean(key: "isLoaded", value: state.isLoaded)
        payload.setBoolean(key: "isGenerating", value: state.isGenerating)
        payload.setString(key: "modelId", value: state.modelId)
        if let errorMsg = state.error {
            payload.setString(key: "error", value: errorMsg)
        }
        payload.setString(key: "modelInfo", value: state.modelInfo)
        payload.setString(key: "type", value: eventTypeToString(.onstatechange))
        emitEvent(.onstatechange, payload: payload)
    }
    
    private func emitErrorEvent(_ message: String) {
        let payload = AnyMapHolder()
        payload.setString(key: "message", value: message)
        payload.setString(key: "type", value: eventTypeToString(.onerror))
        emitEvent(.onerror, payload: payload)
    }
    
    private func emitGenerationCompleteEvent(tokensPerSecond: Double) {
        let payload = AnyMapHolder()
        payload.setDouble(key: "tokensPerSecond", value: tokensPerSecond)
        payload.setString(key: "type", value: eventTypeToString(.ongenerationcomplete))
        emitEvent(.ongenerationcomplete, payload: payload)
    }
    
    // Helper to convert event type enum to string
    private func eventTypeToString(_ eventType: RNMLXEventTypes) -> String {
        switch eventType {
        case .ontokengeneration:
            return "onTokenGeneration"
        case .onmodelloadprogress:
            return "onModelLoadProgress"
        case .onstatechange:
            return "onStateChange"
        case .onerror:
            return "onError"
        case .ongenerationcomplete:
            return "onGenerationComplete"
        @unknown default:
            return "unknown"
        }
    }
}
