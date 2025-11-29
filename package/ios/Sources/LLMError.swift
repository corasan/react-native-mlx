import Foundation

public enum LLMError: Error {
    case notLoaded
    case generationFailed(String)
}
