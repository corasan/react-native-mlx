///
/// Func_void_std__variant_std__string__double__ModelState_.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/**
 * Wraps a Swift `(_ payload: Variant_String_Double_ModelState) -> Void` as a class.
 * This class can be used from C++, e.g. to wrap the Swift closure as a `std::function`.
 */
public final class Func_void_std__variant_std__string__double__ModelState_ {
  public typealias bridge = margelo.nitro.rnmlx.bridge.swift

  private let closure: (_ payload: Variant_String_Double_ModelState) -> Void

  public init(_ closure: @escaping (_ payload: Variant_String_Double_ModelState) -> Void) {
    self.closure = closure
  }

  @inline(__always)
  public func call(payload: bridge.std__variant_std__string__double__ModelState_) -> Void {
    self.closure({ () -> Variant_String_Double_ModelState in
      let __variant = payload
      switch __variant.index() {
        case 0:
          let __actual = __variant.get_0()
          return .someString(String(__actual))
        case 1:
          let __actual = __variant.get_1()
          return .someDouble(__actual)
        case 2:
          let __actual = __variant.get_2()
          return .someModelState(__actual)
        default:
          fatalError("Variant can never have index \(__variant.index())!")
      }
    }())
  }

  /**
   * Casts this instance to a retained unsafe raw pointer.
   * This acquires one additional strong reference on the object!
   */
  @inline(__always)
  public func toUnsafe() -> UnsafeMutableRawPointer {
    return Unmanaged.passRetained(self).toOpaque()
  }

  /**
   * Casts an unsafe pointer to a `Func_void_std__variant_std__string__double__ModelState_`.
   * The pointer has to be a retained opaque `Unmanaged<Func_void_std__variant_std__string__double__ModelState_>`.
   * This removes one strong reference from the object!
   */
  @inline(__always)
  public static func fromUnsafe(_ pointer: UnsafeMutableRawPointer) -> Func_void_std__variant_std__string__double__ModelState_ {
    return Unmanaged<Func_void_std__variant_std__string__double__ModelState_>.fromOpaque(pointer).takeRetainedValue()
  }
}
