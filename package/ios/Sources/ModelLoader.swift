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
    private var activeDownloads = NSMapTable<URLSessionDownloadTask, AnyObject>.strongToStrongObjects()
    private var downloadContinuations = NSMapTable<URLSessionDownloadTask, AnyObject>.strongToStrongObjects()
    private lazy var urlSession = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
    
    func downloadModelFiles(
        repoId: String,
        modelDirectory: URL,
        progress: @escaping (DownloadProgress) -> Void
    ) async throws {
        self.downloadProgress = progress
        let baseURL = "https://huggingface.co/\(repoId)/resolve/main"
        let files = ["config.json", "tokenizer.json", "model.safetensors"]
        
        try await withThrowingTaskGroup(of: Void.self) { group in
            for file in files {
                let destinationURL = modelDirectory.appendingPathComponent(file)
                if fileManager.fileExists(atPath: destinationURL.path) { continue }
                
                guard let url = URL(string: "\(baseURL)/\(file)") else {
                    throw RNMLXError.downloadError("Invalid URL for \(file)")
                }
                
                group.addTask {
                    try await self.downloadFile(from: url, to: destinationURL, fileName: file)
                }
            }
            try await group.waitForAll()
        }
    }
    
    private func downloadFile(from url: URL, to destinationURL: URL, fileName: String) async throws {
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            let task = urlSession.downloadTask(with: url)
            let downloadInfo = DownloadInfo(destination: destinationURL, fileName: fileName)
            
            activeDownloads.setObject(downloadInfo, forKey: task)
            downloadContinuations.setObject(continuation as AnyObject, forKey: task)
            
            task.resume()
        }
    }
    
    
}

extension ModelLoader: URLSessionDownloadDelegate {
    func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didWriteData bytesWritten: Int64,
        totalBytesWritten: Int64,
        totalBytesExpectedToWrite: Int64
    ) {
        guard let downloadInfo = activeDownloads.object(forKey: downloadTask) as? DownloadInfo,
              totalBytesExpectedToWrite > 0 else { return }
        
        Task { @MainActor in
            downloadProgress?(DownloadProgress(
                fileName: downloadInfo.fileName,
                bytesDownloaded: totalBytesWritten,
                totalBytes: totalBytesExpectedToWrite
            ))
        }
    }
    
    func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didFinishDownloadingTo location: URL
    ) {
        guard let downloadInfo = activeDownloads.object(forKey: downloadTask) as? DownloadInfo,
              let continuation = downloadContinuations.object(forKey: downloadTask) as? CheckedContinuation<Void, Error> else { return }
        
        do {
            if fileManager.fileExists(atPath: downloadInfo.destination.path) {
                try fileManager.removeItem(at: downloadInfo.destination)
            }
            try fileManager.moveItem(at: location, to: downloadInfo.destination)
            continuation.resume()
        } catch {
            continuation.resume(throwing: RNMLXError.downloadError("Failed to save file: \(error.localizedDescription)"))
        }
        
        activeDownloads.removeObject(forKey: downloadTask)
        downloadContinuations.removeObject(forKey: downloadTask)
    }
    
    func urlSession(
        _ session: URLSession,
        task: URLSessionTask,
        didCompleteWithError error: Error?
    ) {
        guard let error = error,
              let downloadTask = task as? URLSessionDownloadTask,
              let continuation = downloadContinuations.object(forKey: downloadTask) as? CheckedContinuation<Void, Error> else { return }
        
        continuation.resume(throwing: RNMLXError.downloadError(error.localizedDescription))
        activeDownloads.removeObject(forKey: downloadTask)
        downloadContinuations.removeObject(forKey: downloadTask)
    }
}

private class DownloadInfo {
    let destination: URL
    let fileName: String
    
    init(destination: URL, fileName: String) {
        self.destination = destination
        self.fileName = fileName
    }
}
