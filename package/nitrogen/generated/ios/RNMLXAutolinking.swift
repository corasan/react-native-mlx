///
/// RNMLXAutolinking.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

public final class RNMLXAutolinking {
  public typealias bridge = margelo.nitro.rnmlx.bridge.swift

  /**
   * Creates an instance of a Swift class that implements `HybridMLXSpec`,
   * and wraps it in a Swift class that can directly interop with C++ (`HybridMLXSpec_cxx`)
   *
   * This is generated by Nitrogen and will initialize the class specified
   * in the `"autolinking"` property of `nitro.json` (in this case, `HybridMLX`).
   */
  public static func createMLX() -> bridge.std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_ {
    let hybridObject = HybridMLX()
    return { () -> bridge.std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_ in
      let __cxxWrapped = hybridObject.getCxxWrapper()
      return __cxxWrapped.getCxxPart()
    }()
  }
}
