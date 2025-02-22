//
//  ReactNativeMLX.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation
internal import MLX

final class WeightsContainer {
    let weights: [String: MLXArray]
    
    init(weights: [String: MLXArray]) {
        self.weights = weights
    }
}

public class RNMLX {
    private var weights: [String: MLXArray]?
    private var config: ModelConfiguration?
    private let modelCache = NSCache<NSString, WeightsContainer>()
    private let modelLoader = ModelLoader()
    private let fileManager = FileManager.default
    
    public init() {}
    
    public func load(
        modelId: String,
        repoId: String,
        progress: @escaping (DownloadProgress) -> Void
    ) async throws -> Bool {
        let cacheKey = NSString(string: modelId)
        
        // Check cache first
        if let cachedContainer = modelCache.object(forKey: cacheKey) {
            self.weights = cachedContainer.weights
            return true
        }
        
        // Get documents directory
        guard let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            throw MLXError.modelLoadError("Cannot access documents directory")
        }
        
        let modelDirectory = documentsPath.appendingPathComponent("mlx_models").appendingPathComponent(modelId)
        
        do {
            // Create model directory if needed
            try fileManager.createDirectory(at: modelDirectory, withIntermediateDirectories: true)
            
            // Download model files if they don't exist
            try await modelLoader.downloadModelFiles(
                repoId: repoId,
                modelDirectory: modelDirectory,
                progress: progress
            )
            
            // Load the configuration
            let configPath = modelDirectory.appendingPathComponent("config.json")
            let configData = try Data(contentsOf: configPath)
            self.config = try JSONDecoder().decode(ModelConfiguration.self, from: configData)
            
            // Load safetensors weights
            let weightsPath = modelDirectory.appendingPathComponent("model.safetensors")
            self.weights = try modelLoader.loadWeights(from: weightsPath.path)
            
            // Cache the loaded weights
            if let loadedWeights = self.weights {
                let container = WeightsContainer(weights: loadedWeights)
                modelCache.setObject(container, forKey: cacheKey)
            }
            
            return true
        } catch {
            throw MLXError.modelLoadError("Failed to load model: \(error.localizedDescription)")
        }
    }
}
