//
//  ReactNativeMLX.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation
internal import MLX

public struct ModelState {
    public let isLoaded: Bool
    public let isGenerating: Bool
    public let modelId: String
    public let error: String?
    public let modelInfo: String
    
    public init(isLoaded: Bool = false,
                isGenerating: Bool = false,
                modelId: String = "",
                error: String? = nil,
                modelInfo: String = "") {
        self.isLoaded = isLoaded
        self.isGenerating = isGenerating
        self.modelId = modelId
        self.error = error
        self.modelInfo = modelInfo
    }
}

public protocol RNMLXDelegate: AnyObject {
    func modelLoadingProgress(progress: Double, file: String)
    func modelGenerationProgress(text: String, tokensPerSecond: Double)
    func modelStateChanged(state: ModelState)
    func modelError(_ error: Error)
}

@MainActor
public class RNMLX {
    public weak var delegate: RNMLXDelegate?
    private var llm: LLMEvaluator
    private var state = ModelState()
    
    public init() {
        self.llm = LLMEvaluator()
        self.llm.progressHandler = { [weak self] progress, file in
            self?.delegate?.modelLoadingProgress(progress: progress, file: file)
        }
        self.llm.generationHandler = { [weak self] text, tokensPerSecond in
            self?.delegate?.modelGenerationProgress(text: text, tokensPerSecond: tokensPerSecond)
        }
    }
    
    public func generate(prompt: String) async {
        await llm.generate(prompt: prompt)
    }
    
    public func load(modelId: String) async throws {
        do {
            _ = try await llm.load()
            state = ModelState(isLoaded: true, modelId: modelId)
        } catch {
            state = ModelState(isLoaded: false, modelId: modelId, error: error.localizedDescription)
            throw error
        }
        
        delegate?.modelStateChanged(state: state)
    }
}
