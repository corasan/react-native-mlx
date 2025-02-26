///
/// HybridMLXSpec_cxx.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import Foundation
import NitroModules

/**
 * A class implementation that bridges HybridMLXSpec over to C++.
 * In C++, we cannot use Swift protocols - so we need to wrap it in a class to make it strongly defined.
 *
 * Also, some Swift types need to be bridged with special handling:
 * - Enums need to be wrapped in Structs, otherwise they cannot be accessed bi-directionally (Swift bug: https://github.com/swiftlang/swift/issues/75330)
 * - Other HybridObjects need to be wrapped/unwrapped from the Swift TCxx wrapper
 * - Throwing methods need to be wrapped with a Result<T, Error> type, as exceptions cannot be propagated to C++
 */
public class HybridMLXSpec_cxx {
  /**
   * The Swift <> C++ bridge's namespace (`margelo::nitro::rnmlx::bridge::swift`)
   * from `RNMLX-Swift-Cxx-Bridge.hpp`.
   * This contains specialized C++ templates, and C++ helper functions that can be accessed from Swift.
   */
  public typealias bridge = margelo.nitro.rnmlx.bridge.swift

  /**
   * Holds an instance of the `HybridMLXSpec` Swift protocol.
   */
  private var __implementation: any HybridMLXSpec

  /**
   * Holds a weak pointer to the C++ class that wraps the Swift class.
   */
  private var __cxxPart: bridge.std__weak_ptr_margelo__nitro__rnmlx__HybridMLXSpec_

  /**
   * Create a new `HybridMLXSpec_cxx` that wraps the given `HybridMLXSpec`.
   * All properties and methods bridge to C++ types.
   */
  public init(_ implementation: any HybridMLXSpec) {
    self.__implementation = implementation
    self.__cxxPart = .init()
    /* no base class */
  }

  /**
   * Get the actual `HybridMLXSpec` instance this class wraps.
   */
  @inline(__always)
  public func getHybridMLXSpec() -> any HybridMLXSpec {
    return __implementation
  }

  /**
   * Casts this instance to a retained unsafe raw pointer.
   * This acquires one additional strong reference on the object!
   */
  public func toUnsafe() -> UnsafeMutableRawPointer {
    return Unmanaged.passRetained(self).toOpaque()
  }

  /**
   * Casts an unsafe pointer to a `HybridMLXSpec_cxx`.
   * The pointer has to be a retained opaque `Unmanaged<HybridMLXSpec_cxx>`.
   * This removes one strong reference from the object!
   */
  public class func fromUnsafe(_ pointer: UnsafeMutableRawPointer) -> HybridMLXSpec_cxx {
    return Unmanaged<HybridMLXSpec_cxx>.fromOpaque(pointer).takeRetainedValue()
  }

  /**
   * Gets (or creates) the C++ part of this Hybrid Object.
   * The C++ part is a `std::shared_ptr<margelo::nitro::rnmlx::HybridMLXSpec>`.
   */
  public func getCxxPart() -> bridge.std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_ {
    let cachedCxxPart = self.__cxxPart.lock()
    if cachedCxxPart.__convertToBool() {
      return cachedCxxPart
    } else {
      let newCxxPart = bridge.create_std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_(self.toUnsafe())
      __cxxPart = bridge.weakify_std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_(newCxxPart)
      return newCxxPart
    }
  }

  

  /**
   * Get the memory size of the Swift class (plus size of any other allocations)
   * so the JS VM can properly track it and garbage-collect the JS object if needed.
   */
  @inline(__always)
  public var memorySize: Int {
    return MemoryHelper.getSizeOf(self.__implementation) + self.__implementation.memorySize
  }

  // Properties
  public final var output: std.string {
    @inline(__always)
    get {
      return std.string(self.__implementation.output)
    }
    @inline(__always)
    set {
      self.__implementation.output = String(newValue)
    }
  }
  
  public final var tokensPerSecond: Double {
    @inline(__always)
    get {
      return self.__implementation.tokensPerSecond
    }
    @inline(__always)
    set {
      self.__implementation.tokensPerSecond = newValue
    }
  }
  
  public final var downloadProgress: Double {
    @inline(__always)
    get {
      return self.__implementation.downloadProgress
    }
    @inline(__always)
    set {
      self.__implementation.downloadProgress = newValue
    }
  }
  
  public final var currentFile: std.string {
    @inline(__always)
    get {
      return std.string(self.__implementation.currentFile)
    }
    @inline(__always)
    set {
      self.__implementation.currentFile = String(newValue)
    }
  }
  
  public final var error: std.string {
    @inline(__always)
    get {
      return std.string(self.__implementation.error)
    }
    @inline(__always)
    set {
      self.__implementation.error = String(newValue)
    }
  }
  
  public final var state: ModelState {
    @inline(__always)
    get {
      return self.__implementation.state
    }
    @inline(__always)
    set {
      self.__implementation.state = newValue
    }
  }

  // Methods
  @inline(__always)
  public final func load(modelId: std.string) -> bridge.Result_std__shared_ptr_Promise_void___ {
    do {
      let __result = try self.__implementation.load(modelId: String(modelId))
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_void__ in
        let __promise = bridge.create_std__shared_ptr_Promise_void__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_void__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve() })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func generate(prompt: std.string) -> bridge.Result_std__shared_ptr_Promise_void___ {
    do {
      let __result = try self.__implementation.generate(prompt: String(prompt))
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_void__ in
        let __promise = bridge.create_std__shared_ptr_Promise_void__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_void__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve() })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func listenToTokenGeneration(listener: bridge.Func_void_std__string) -> bridge.Result_void_ {
    do {
      try self.__implementation.listenToTokenGeneration(listener: { () -> (String) -> Void in
        let __wrappedFunction = bridge.wrap_Func_void_std__string(listener)
        return { (__token: String) -> Void in
          __wrappedFunction.call(std.string(__token))
        }
      }())
      return bridge.create_Result_void_()
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_void_(__exceptionPtr)
    }
  }
}
