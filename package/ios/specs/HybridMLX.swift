import Foundation
import NitroModules

@MainActor
class HybridMLX: HybridMLXSpec {
    private var llm = RNMLX()
    
    // Implement properties with getters and setters
    var output: String {
        get { llm.output }
        set { /* no-op since RNMLX manages this */ }
    }
    
    var tokensPerSecond: Double {
        get { llm.tokensPerSecond }
        set { /* no-op since RNMLX manages this */ }
    }
    
    var downloadProgress: Double {
        get { llm.downloadProgress }
        set { /* no-op since RNMLX manages this */ }
    }
    
    var currentFile: String {
        get { llm.currentFile }
        set { /* no-op since RNMLX manages this */ }
    }
    
    var error: String {
        get { llm.error }
        set { /* no-op since RNMLX manages this */ }
    }
    
    var state: ModelState {
        get { llm.state }
        set { /* no-op since RNMLX manages this */ }
    }

    func load(modelId: String) -> Promise<Void> {
        return Promise.async {
            try await self.llm.load(modelId: modelId)
        }
    }
    
    func generate(prompt: String) -> Promise<Void> {
        return Promise.async {
            print("Output will be generated based on: \(prompt)")
            await self.llm.generate(prompt: prompt)
        }
    }
}
