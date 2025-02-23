//
//  ReactNativeMLX.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation
internal import MLX

public protocol RNMLXDelegate: AnyObject {
    func modelLoadingProgress(progress: Double, file: String)
    func modelGenerationProgress(text: String, tokensPerSecond: Double)
    func modelStateChanged(state: MLXState)
    func modelError(_ error: Error)
}

@MainActor
public class RNMLX {
    public weak var delegate: RNMLXDelegate?
    private var llm: LLMEvaluator
    
    // Public state properties
    public private(set) var state = ModelState(
        isLoaded: false,
        isGenerating: false,
        modelId: "",
        error: nil,
        modelInfo: ""
    )
    public private(set) var output: String = ""
    public private(set) var tokensPerSecond: Double = 0
    public private(set) var downloadProgress: Double = 0
    public private(set) var currentFile: String = ""
    public private(set) var error: String = ""
    
    public init() {
        self.llm = LLMEvaluator()
        self.llm.progressHandler = { [weak self] progress, file in
            guard let self else { return }
            self.downloadProgress = progress
            self.currentFile = file
            self.delegate?.modelLoadingProgress(progress: progress, file: file)
        }
        self.llm.generationHandler = { [weak self] text, tokensPerSecond in
            guard let self else { return }
            self.output = text
            self.tokensPerSecond = tokensPerSecond
            print("output -> \(text)")
            print("tokensPerSecond -> \(tokensPerSecond)")
            self.delegate?.modelGenerationProgress(text: text, tokensPerSecond: tokensPerSecond)
        }
    }
    
    public func generate(prompt: String) async {
        output = ""
        tokensPerSecond = 0
        error = ""
        print("in RNMLX.generate: \(prompt)")
        await llm.generate(prompt: prompt)
    }
    
    public func load(modelId: String) async throws {
        downloadProgress = 0
        currentFile = ""
        error = ""
        
        do {
            _ = try await llm.load()
            state = ModelState(
                isLoaded: true,
                isGenerating: false,
                modelId: modelId,
                error: nil,
                modelInfo: llm.modelInfo
            )
        } catch {
            state = ModelState(
                isLoaded: false,
                isGenerating: false,
                modelId: modelId,
                error: error.localizedDescription,
                modelInfo: ""
            )
            throw error
        }
        
        delegate?.modelStateChanged(state: state)
    }
}
