import Foundation

actor ModelDownloader: NSObject {
    static let shared = ModelDownloader()
    static var debug: Bool = false

    private let fileManager = FileManager.default

    private func log(_ message: String) {
        if Self.debug {
            print("[Downloader] \(message)")
        }
    }

    func download(
        modelId: String,
        progressCallback: @escaping (Double) -> Void
    ) async throws -> URL {
        let requiredFiles = [
            "config.json",
            "tokenizer.json",
            "tokenizer_config.json",
            "model.safetensors"
        ]

        let modelDir = getModelDirectory(modelId: modelId)
        try fileManager.createDirectory(at: modelDir, withIntermediateDirectories: true)

        log("Model directory: \(modelDir.path)")
        log("Files to download: \(requiredFiles)")

        var downloaded = 0

        for file in requiredFiles {
            let destURL = modelDir.appendingPathComponent(file)

            if fileManager.fileExists(atPath: destURL.path) {
                log("File exists, skipping: \(file)")
                downloaded += 1
                progressCallback(Double(downloaded) / Double(requiredFiles.count))
                continue
            }

            let urlString = "https://huggingface.co/\(modelId)/resolve/main/\(file)"
            guard let url = URL(string: urlString) else {
                log("Invalid URL: \(urlString)")
                continue
            }

            log("Downloading: \(file)")

            let (tempURL, response) = try await URLSession.shared.download(from: url)

            guard let httpResponse = response as? HTTPURLResponse else {
                log("Invalid response for: \(file)")
                continue
            }

            log("Response status: \(httpResponse.statusCode) for \(file)")

            if httpResponse.statusCode == 200 {
                if fileManager.fileExists(atPath: destURL.path) {
                    try fileManager.removeItem(at: destURL)
                }
                try fileManager.moveItem(at: tempURL, to: destURL)
                log("Saved: \(file)")
            } else {
                log("Failed to download: \(file) - Status: \(httpResponse.statusCode)")
            }

            downloaded += 1
            progressCallback(Double(downloaded) / Double(requiredFiles.count))
        }

        return modelDir
    }

    func isDownloaded(modelId: String) -> Bool {
        let modelDir = getModelDirectory(modelId: modelId)
        let requiredFiles = ["config.json", "model.safetensors", "tokenizer.json"]

        let allExist = requiredFiles.allSatisfy { file in
            fileManager.fileExists(atPath: modelDir.appendingPathComponent(file).path)
        }

        log("isDownloaded(\(modelId)): \(allExist)")
        return allExist
    }

    func getModelDirectory(modelId: String) -> URL {
        let docsDir = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        return docsDir
            .appendingPathComponent("huggingface/models")
            .appendingPathComponent(modelId.replacingOccurrences(of: "/", with: "_"))
    }

    func deleteModel(modelId: String) throws {
        let modelDir = getModelDirectory(modelId: modelId)
        if fileManager.fileExists(atPath: modelDir.path) {
            try fileManager.removeItem(at: modelDir)
        }
    }
}
