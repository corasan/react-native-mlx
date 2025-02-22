//
//  ModelViewModel.swift
//  MLXExample
//
//  Created by Henry on 2/22/25.
//

import Foundation
import ReactNativeMLX

@MainActor
class ModelViewModel: ObservableObject, RNMLXDelegate {
    @Published var status: String = ""
    @Published var error: String = ""
    @Published var isLoading = false
    @Published var downloadProgress: Double = 0
    @Published var currentFile: String = ""
    @Published var output: String = ""
    @Published var tokensPerSecond: Double = 0
    
    private let mlx = RNMLX()
    
    init() {
        mlx.delegate = self
    }
    
    func modelLoadingProgress(progress: Double, file: String) {
        downloadProgress = progress
        currentFile = file
    }
    
    func modelGenerationProgress(text: String, tokensPerSecond: Double) {
        output = text
        self.tokensPerSecond = tokensPerSecond
    }
    
    func modelStateChanged(state: ModelState) {
        isLoading = !state.isLoaded
        if let error = state.error {
            self.error = error
        }
    }
    
    func modelError(_ error: Error) {
        self.error = error.localizedDescription
    }
    
    func loadLlama() async {
        await loadModel(
            name: "Llama 3.2 1B Instruct 4bit",
            modelId: "llama-3.1b-instruct-4bit",
            repoId: "mlx-community/Llama-3.2-1B-Instruct-4bit"
        )
    }
    
    func generate(prompt: String) async {
        error = ""
        output = ""
        tokensPerSecond = 0
        await mlx.generate(prompt: prompt)
    }
    
    private func loadModel(name: String, modelId: String, repoId: String) async {
        guard !isLoading else { return }
        
        isLoading = true
        error = ""
        downloadProgress = 0
        
        do {
            try await mlx.load(modelId: modelId)
        } catch {
            self.error = error.localizedDescription
        }
    }
}
