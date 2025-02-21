///
/// ReactNativeMLX-Swift-Cxx-Umbrella.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

// Forward declarations of C++ defined types
// Forward declaration of `HybridMLXSpec` to properly resolve imports.
namespace margelo::nitro::mlx { class HybridMLXSpec; }

// Include C++ defined types
#include "HybridMLXSpec.hpp"
#include <NitroModules/Result.hpp>
#include <exception>
#include <memory>

// C++ helpers for Swift
#include "ReactNativeMLX-Swift-Cxx-Bridge.hpp"

// Common C++ types used in Swift
#include <NitroModules/ArrayBufferHolder.hpp>
#include <NitroModules/AnyMapHolder.hpp>
#include <NitroModules/HybridContext.hpp>
#include <NitroModules/RuntimeError.hpp>

// Forward declarations of Swift defined types
// Forward declaration of `HybridMLXSpec_cxx` to properly resolve imports.
namespace ReactNativeMLX { class HybridMLXSpec_cxx; }

// Include Swift defined types
#if __has_include("ReactNativeMLX-Swift.h")
// This header is generated by Xcode/Swift on every app build.
// If it cannot be found, make sure the Swift module's name (= podspec name) is actually "ReactNativeMLX".
#include "ReactNativeMLX-Swift.h"
// Same as above, but used when building with frameworks (`use_frameworks`)
#elif __has_include(<ReactNativeMLX/ReactNativeMLX-Swift.h>)
#include <ReactNativeMLX/ReactNativeMLX-Swift.h>
#else
#error ReactNativeMLX's autogenerated Swift header cannot be found! Make sure the Swift module's name (= podspec name) is actually "ReactNativeMLX", and try building the app first.
#endif
