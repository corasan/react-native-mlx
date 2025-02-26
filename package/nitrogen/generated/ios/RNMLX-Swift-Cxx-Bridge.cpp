///
/// RNMLX-Swift-Cxx-Bridge.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "RNMLX-Swift-Cxx-Bridge.hpp"

// Include C++ implementation defined types
#include "HybridMLXSpecSwift.hpp"
#include "RNMLX-Swift-Cxx-Umbrella.hpp"

namespace margelo::nitro::rnmlx::bridge::swift {

  // pragma MARK: std::function<void()>
  Func_void create_Func_void(void* _Nonnull swiftClosureWrapper) {
    auto swiftClosure = RNMLX::Func_void::fromUnsafe(swiftClosureWrapper);
    return [swiftClosure = std::move(swiftClosure)]() mutable -> void {
      swiftClosure.call();
    };
  }
  
  // pragma MARK: std::function<void(const std::exception_ptr& /* error */)>
  Func_void_std__exception_ptr create_Func_void_std__exception_ptr(void* _Nonnull swiftClosureWrapper) {
    auto swiftClosure = RNMLX::Func_void_std__exception_ptr::fromUnsafe(swiftClosureWrapper);
    return [swiftClosure = std::move(swiftClosure)](const std::exception_ptr& error) mutable -> void {
      swiftClosure.call(error);
    };
  }
  
  // pragma MARK: std::function<void(const std::string& /* token */)>
  Func_void_std__string create_Func_void_std__string(void* _Nonnull swiftClosureWrapper) {
    auto swiftClosure = RNMLX::Func_void_std__string::fromUnsafe(swiftClosureWrapper);
    return [swiftClosure = std::move(swiftClosure)](const std::string& token) mutable -> void {
      swiftClosure.call(token);
    };
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::rnmlx::HybridMLXSpec>
  std::shared_ptr<margelo::nitro::rnmlx::HybridMLXSpec> create_std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_(void* _Nonnull swiftUnsafePointer) {
    RNMLX::HybridMLXSpec_cxx swiftPart = RNMLX::HybridMLXSpec_cxx::fromUnsafe(swiftUnsafePointer);
    return std::make_shared<margelo::nitro::rnmlx::HybridMLXSpecSwift>(swiftPart);
  }
  void* _Nonnull get_std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_(std__shared_ptr_margelo__nitro__rnmlx__HybridMLXSpec_ cppType) {
    std::shared_ptr<margelo::nitro::rnmlx::HybridMLXSpecSwift> swiftWrapper = std::dynamic_pointer_cast<margelo::nitro::rnmlx::HybridMLXSpecSwift>(cppType);
  #ifdef NITRO_DEBUG
    if (swiftWrapper == nullptr) [[unlikely]] {
      throw std::runtime_error("Class \"HybridMLXSpec\" is not implemented in Swift!");
    }
  #endif
    RNMLX::HybridMLXSpec_cxx& swiftPart = swiftWrapper->getSwiftPart();
    return swiftPart.toUnsafe();
  }

} // namespace margelo::nitro::rnmlx::bridge::swift
