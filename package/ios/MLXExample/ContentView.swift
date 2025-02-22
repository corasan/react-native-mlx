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
    
    var body: some View {
        VStack(spacing: 20) {
            Text("MLX Model Test")
                .font(.largeTitle)
                .padding()
            
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
            
            if viewModel.isLoading {
                ProgressSection(
                    fileName: viewModel.currentFile,
                    progress: viewModel.downloadProgress
                )
            }
            
            if !viewModel.output.isEmpty {
                GenerationOutputView(
                    output: viewModel.output,
                    tokensPerSecond: viewModel.tokensPerSecond
                )
            }
            
            if !viewModel.error.isEmpty {
                Text(viewModel.error)
                    .foregroundColor(.red)
                    .padding()
            }
        }
        .padding()
    }
}

struct ProgressSection: View {
    let fileName: String
    let progress: Double
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Downloading: \(fileName)")
            
            ProgressView(value: progress, total: 100)
                .progressViewStyle(.linear)
            
            Text(String(format: "%.1f%%", progress))
                .font(.caption)
        }
        .padding()
        .frame(maxWidth: 300)
    }
}

struct GenerationOutputView: View {
    let output: String
    let tokensPerSecond: Double
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(output)
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
            
            if tokensPerSecond > 0 {
                Text("Speed: \(String(format: "%.1f", tokensPerSecond)) tokens/sec")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
    }
}

#Preview {
    ContentView()
}
