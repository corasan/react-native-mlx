# mlx-swift-lm Research

## Overview

`mlx-swift-lm` is a Swift package for building tools and applications with large language models (LLMs) and vision language models (VLMs) using MLX Swift.

**Repository**: https://github.com/ml-explore/mlx-swift-lm

**Current Version in Project**: 2.29.2

## Available Libraries

| Library | Description |
|---------|-------------|
| MLXLLM | Large language model implementations |
| MLXVLM | Vision language model implementations |
| MLXLMCommon | Shared/unified API for LLMs and VLMs |
| MLXEmbedders | Encoder and embedding model implementations |

## Current Implementation (react-native-mlx)

Located in `package/ios/Sources/LLMEvaluator.swift`:

```swift
import MLXLLM
import MLXLMCommon

let modelConfiguration = ModelRegistry.llama3_2_1B_4bit
let generateParameters = GenerateParameters(temperature: 0.6)

func load() async throws -> ModelContainer {
    MLX.GPU.set(cacheLimit: 20 * 1024 * 1024)

    let modelContainer = try await LLMModelFactory.shared.loadContainer(
        configuration: modelConfiguration
    ) { progress in
        // Progress callback
    }
    return modelContainer
}

func generate(prompt: String) async {
    let result = try await modelContainer.perform { context in
        let input = try await context.processor.prepare(
            input: .init(messages: [
                ["role": "system", "content": "You are a helpful assistant."],
                ["role": "user", "content": prompt],
            ]))
        return try MLXLMCommon.generate(
            input: input,
            parameters: generateParameters,
            context: context
        ) { tokens in
            let text = context.tokenizer.decode(tokens: tokens)
            // Handle streaming tokens
            return tokens.count >= maxTokens ? .stop : .more
        }
    }
}
```

## New Simplified API (ChatSession)

The new API is located in `Libraries/MLXLMCommon/Streamlined.swift`.

### Basic Usage

```swift
let model = try await loadModel(id: "mlx-community/Qwen3-4B-4bit")
let session = ChatSession(model)

// Non-streaming
let response = try await session.respond(to: "What is the capital of France?")

// Streaming
for try await chunk in session.streamResponse(to: "Tell me a story") {
    print(chunk)
}
```

### Vision Language Models (VLM)

```swift
let model = try await loadModel(id: "mlx-community/Qwen2.5-VL-3B-Instruct-4bit")
let session = ChatSession(model)

let answer = try await session.respond(
    to: "What kind of creature is in the picture?",
    image: .url(URL(fileURLWithPath: "path/to/image.jpg"))
)
```

## API Reference

### Loading Functions (ModelFactory.swift)

| Function | Description |
|----------|-------------|
| `loadModel(hub:id:revision:progressHandler:)` | Load model by HuggingFace ID |
| `loadModelContainer(hub:configuration:progressHandler:)` | Load with ModelConfiguration |
| `loadModel(hub:directory:progressHandler:)` | Load from local directory |
| `loadModelContainer(hub:id:revision:progressHandler:)` | Load container by ID |

### ChatSession Class

**Initializers:**
- `ChatSession(_ container: ModelContainer, ...)`
- `ChatSession(_ context: ModelContext, ...)`

**Parameters:**
- `instructions: String?` - System prompt
- `generateParameters: GenerateParameters` - Temperature, etc.
- `extraEOSTokens: Set<String>?` - Additional stop tokens

**Methods:**
- `respond(to:images:videos:)` → `String` - Full response
- `streamResponse(to:images:videos:)` → `AsyncThrowingStream<String, Error>` - Streaming

### Generate Functions (Evaluate.swift)

**Synchronous with callback:**
```swift
func generate(
    input: LMInput,
    parameters: GenerateParameters,
    context: ModelContext,
    didGenerate: ([Int]) -> GenerateDisposition
) -> GenerateResult
```

**Async streaming:**
```swift
func generate(
    input: LMInput,
    cache: [KVCache]? = nil,
    parameters: GenerateParameters,
    context: ModelContext
) -> AsyncStream<Generation>
```

### Result Types

**GenerateResult:**
- `inputText: String`
- `output: String`
- `tokens: [Int]`
- `tokensPerSecond: Double`
- `promptTime: TimeInterval`
- `generateTime: TimeInterval`

**Generation (enum for streaming):**
- `.chunk(String)` - Decoded text chunk
- `.info(GenerateCompletionInfo)` - Completion metrics
- `.toolCall(ToolCall)` - Tool call output

### GenerateDisposition

Return from callback to control generation:
- `.more` - Continue generating
- `.stop` - Stop generation

## File Structure (MLXLMCommon)

```
Libraries/MLXLMCommon/
├── Adapters/
├── Documentation.docc/
├── Extensions/
├── Models/
├── Registries/
├── Tool/
├── AttentionUtils.swift
├── BaseConfiguration.swift
├── Chat.swift              # Chat.Message struct
├── Evaluate.swift          # generate() functions
├── KVCache.swift
├── LanguageModel.swift
├── Load.swift              # downloadModel(), loadWeights()
├── ModelConfiguration.swift
├── ModelContainer.swift
├── ModelFactory.swift      # loadModel(), loadModelContainer()
├── Streamlined.swift       # ChatSession class
├── Tokenizer.swift
└── UserInput.swift
```

## Migration Comparison

| Feature | Old (Current) | New (ChatSession) |
|---------|---------------|-------------------|
| Model Loading | `LLMModelFactory.shared.loadContainer()` | `loadModel(id:)` |
| Configuration | `ModelRegistry.modelName` | Pass ID string directly |
| Generation | Manual `MLXLMCommon.generate()` | `session.respond()` |
| Streaming | Callback with token array | `AsyncThrowingStream<String>` |
| Progress | Manual handler in closure | Built into `loadModel` |
| Multi-turn | Manual message array | Automatic in ChatSession |
| VLM Support | Not implemented | Built-in image/video params |

## Custom Model Configuration

For models not in registry:

```swift
let customModel = ModelConfiguration(
    id: "mlx-community/Phi-4-mini-instruct-4bit",
    defaultPrompt: "You are a helpful assistant.",
    extraEOSTokens: ["<|end|>"]
)
```

## GPU Memory Configuration

```swift
MLX.GPU.set(cacheLimit: 20 * 1024 * 1024) // 20MB cache
```

## Package Integration

**Package.swift:**
```swift
.package(url: "https://github.com/ml-explore/mlx-swift-lm/", branch: "main"),
// or
.package(url: "https://github.com/ml-explore/mlx-swift-lm/", from: "2.29.2"),

.target(
    name: "YourTarget",
    dependencies: [
        .product(name: "MLXLLM", package: "mlx-swift-lm"),
        .product(name: "MLXLMCommon", package: "mlx-swift-lm"),
    ]
)
```

**Podspec (current):**
```ruby
spm_dependency(s,
    url: "https://github.com/ml-explore/mlx-swift-lm.git",
    requirement: {kind: "upToNextMajorVersion", minimumVersion: "2.29.2"},
    products: ["MLXLLM", "MLXLMCommon"]
)
```

## Sources

- [mlx-swift-lm Repository](https://github.com/ml-explore/mlx-swift-lm)
- [mlx-swift-examples](https://github.com/ml-explore/mlx-swift-examples)
- [MLX Swift](https://github.com/ml-explore/mlx-swift)
- [Running Phi models on iOS](https://www.strathweb.com/2025/03/running-phi-models-on-ios-with-apple-mlx-framework/)
- [Swift Package Index Documentation](https://swiftpackageindex.com/ml-explore/mlx-swift-examples/documentation/mlxlmcommon)
