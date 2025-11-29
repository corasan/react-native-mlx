import Foundation

actor ModelDownloader: NSObject {
    static let shared = ModelDownloader()

    private let fileManager = FileManager.default

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

        print("[Downloader] Model directory: \(modelDir.path)")
        print("[Downloader] Files to download: \(requiredFiles)")

        var downloaded = 0

        for file in requiredFiles {
            let destURL = modelDir.appendingPathComponent(file)

            if fileManager.fileExists(atPath: destURL.path) {
                print("[Downloader] File exists, skipping: \(file)")
                downloaded += 1
                progressCallback(Double(downloaded) / Double(requiredFiles.count))
                continue
            }

            let urlString = "https://huggingface.co/\(modelId)/resolve/main/\(file)"
            guard let url = URL(string: urlString) else {
                print("[Downloader] Invalid URL: \(urlString)")
                continue
            }

            print("[Downloader] Downloading: \(file)")

            let (tempURL, response) = try await URLSession.shared.download(from: url)

            guard let httpResponse = response as? HTTPURLResponse else {
                print("[Downloader] Invalid response for: \(file)")
                continue
            }

            print("[Downloader] Response status: \(httpResponse.statusCode) for \(file)")

            if httpResponse.statusCode == 200 {
                if fileManager.fileExists(atPath: destURL.path) {
                    try fileManager.removeItem(at: destURL)
                }
                try fileManager.moveItem(at: tempURL, to: destURL)
                print("[Downloader] Saved: \(file)")
            } else {
                print("[Downloader] Failed to download: \(file) - Status: \(httpResponse.statusCode)")
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

        print("[Downloader] isDownloaded(\(modelId)): \(allExist)")
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
