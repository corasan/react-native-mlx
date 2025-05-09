///
/// ReactNativeMLXAutolinking.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

public final class ReactNativeMLXAutolinking {
  public typealias bridge = margelo.nitro.rnmlx.bridge.swift

  /**
   * Creates an instance of a Swift class that implements `HybridLLMEvaluatorSpec`,
   * and wraps it in a Swift class that can directly interop with C++ (`HybridLLMEvaluatorSpec_cxx`)
   *
   * This is generated by Nitrogen and will initialize the class specified
   * in the `"autolinking"` property of `nitro.json` (in this case, `HybridLLMEvaluator`).
   */
  public static func createLLMEvaluator() -> bridge.std__shared_ptr_margelo__nitro__rnmlx__HybridLLMEvaluatorSpec_ {
    let hybridObject = HybridLLMEvaluator()
    return { () -> bridge.std__shared_ptr_margelo__nitro__rnmlx__HybridLLMEvaluatorSpec_ in
      let __cxxWrapped = hybridObject.getCxxWrapper()
      return __cxxWrapped.getCxxPart()
    }()
  }
}
