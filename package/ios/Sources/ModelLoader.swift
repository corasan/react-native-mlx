//
//  ModelLoader.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation
internal import MLX

class ModelLoader: NSObject {
    private let fileManager = FileManager.default
    private var downloadProgress: ((DownloadProgress) -> Void)?
    private var downloadedBytes: [String: Int64] = [:]
    private var totalBytes: [String: Int64] = [:]
    
    func downloadModelFiles(
        repoId: String,
        modelDirectory: URL,
        progress: @escaping (DownloadProgress) -> Void
    ) async throws {
        self.downloadProgress = progress
        let baseURL = "https://huggingface.co/\(repoId)/resolve/main"
        
        let files = [
            "config.json",
            "tokenizer.json",
            "model.safetensors"
        ]
        
        for file in files {
            let destinationURL = modelDirectory.appendingPathComponent(file)
            
            // Skip if file already exists
            if fileManager.fileExists(atPath: destinationURL.path) {
                continue
            }
            
            let downloadURL = "\(baseURL)/\(file)"
            guard let url = URL(string: downloadURL) else {
                throw MLXError.downloadError("Invalid URL for \(file)")
            }
            
            try await downloadFile(from: url, to: destinationURL, fileName: file)
        }
    }
    
    private func downloadFile(from url: URL, to destinationURL: URL, fileName: String) async throws {
        let (bytes, response) = try await URLSession.shared.bytes(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw MLXError.downloadError("Failed to download \(fileName)")
        }
        
        let totalBytes = httpResponse.expectedContentLength
        var downloadedBytes: Int64 = 0
        
        // Create the destination file
        if !fileManager.fileExists(atPath: destinationURL.path) {
            fileManager.createFile(atPath: destinationURL.path, contents: nil)
        }
        
        guard let fileHandle = try? FileHandle(forWritingTo: destinationURL) else {
            throw MLXError.downloadError("Could not create file handle for \(fileName)")
        }
        
        defer {
            try? fileHandle.close()
        }
        
        // Process the incoming bytes
        for try await byte in bytes {
            // Convert single byte to Data
            let data = Data([byte])
            try fileHandle.write(contentsOf: data)
            
            downloadedBytes += 1
            
            // Update progress periodically (not for every byte)
            if downloadedBytes % 1024 == 0 { // Update every KB
                let progress = DownloadProgress(
                    fileName: fileName,
                    bytesDownloaded: downloadedBytes,
                    totalBytes: totalBytes
                )
                await MainActor.run {
                    downloadProgress?(progress)
                }
            }
        }
        
        // Final progress update
        let progress = DownloadProgress(
            fileName: fileName,
            bytesDownloaded: downloadedBytes,
            totalBytes: totalBytes
        )
        await MainActor.run {
            downloadProgress?(progress)
        }
    }
    
    func loadWeights(from path: String) throws -> [String: MLXArray] {
        // Implementation needed based on MLX's API
        throw MLXError.modelLoadError("Weight loading not yet implemented")
    }
}

public enum MLXError: Error {
    case modelLoadError(String)
    case downloadError(String)
    case configError(String)
}
