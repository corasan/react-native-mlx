//
//  ContentView.swift
//  MLXExample
//
//  Created by Henry on 2/21/25.
//

import SwiftUI
import ReactNativeMLX

struct ContentView: View {
    @StateObject private var viewModel = ModelViewModel()
    @State private var status: String = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("MLX Model Test")
                .font(.largeTitle)
                .padding()
            
            VStack(spacing: 10) {
                Button(action: {
                    Task {
                        await viewModel.loadLlama()
                    }
                }) {
                    Text("Llama 3.2 1B Instruct 4bit")
                        .frame(minWidth: 200)
                        .padding()
                        .background(viewModel.isLoading ? Color.gray : Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .disabled(viewModel.isLoading)
            }
            
            if viewModel.isLoading {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Downloading: \(viewModel.currentFile)")
                    
                    ProgressView(value: viewModel.downloadProgress, total: 100)
                        .progressViewStyle(.linear)
                    
                    Text(String(format: "%.1f%%", viewModel.downloadProgress))
                        .font(.caption)
                }
                .padding()
                .frame(maxWidth: 300)
            }
            
            if !viewModel.status.isEmpty {
                Text(viewModel.status)
                    .padding()
                    .multilineTextAlignment(.center)
            }
            
            if !viewModel.error.isEmpty {
                Text(viewModel.error)
                    .foregroundColor(.red)
                    .padding()
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

@MainActor
class ModelViewModel: ObservableObject {
    @Published var status: String = ""
    @Published var error: String = ""
    @Published var isLoading = false
    @Published var downloadProgress: Double = 0
    @Published var currentFile: String = ""
    
    private let mlx = RNMLX()
    
    func loadLlama() async {
        await loadModel(
            name: "Llama 3.2 1B Instruct 4bit",
            modelId: "llama-3.1b-instruct-4bit",
            repoId: "mlx-community/Llama-3.2-1B-Instruct-4bit"
        )
    }
    
    private func loadModel(name: String, modelId: String, repoId: String) async {
        guard !isLoading else { return }
        
        isLoading = true
        status = "Loading \(name)..."
        error = ""
        downloadProgress = 0
        
        do {
            let success = try await mlx.load(modelId: modelId, repoId: repoId) { progress in
                self.downloadProgress = progress.percentage
                self.currentFile = progress.fileName
            }
            status = success ? "\(name) loaded successfully!" : "Failed to load \(name)"
        } catch {
            self.error = "Error loading \(name): \(error.localizedDescription)"
            status = "Loading failed"
        }
        
        isLoading = false
    }
}
