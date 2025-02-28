///
/// RNMLX-Swift-Cxx-Umbrella.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

// Forward declarations of C++ defined types
// Forward declaration of `AnyMap` to properly resolve imports.
namespace NitroModules { class AnyMap; }
// Forward declaration of `HybridMLXSpec` to properly resolve imports.
namespace margelo::nitro::rnmlx { class HybridMLXSpec; }
// Forward declaration of `ModelState` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct ModelState; }
// Forward declaration of `RNMLXEventTypes` to properly resolve imports.
namespace margelo::nitro::rnmlx { enum class RNMLXEventTypes; }

// Include C++ defined types
#include "HybridMLXSpec.hpp"
#include "ModelState.hpp"
#include "RNMLXEventTypes.hpp"
#include <NitroModules/AnyMap.hpp>
#include <NitroModules/Promise.hpp>
#include <NitroModules/Result.hpp>
#include <exception>
#include <functional>
#include <memory>
#include <optional>
#include <string>

// C++ helpers for Swift
#include "RNMLX-Swift-Cxx-Bridge.hpp"

// Common C++ types used in Swift
#include <NitroModules/ArrayBufferHolder.hpp>
#include <NitroModules/AnyMapHolder.hpp>
#include <NitroModules/HybridContext.hpp>
#include <NitroModules/RuntimeError.hpp>

// Forward declarations of Swift defined types
// Forward declaration of `HybridMLXSpec_cxx` to properly resolve imports.
namespace RNMLX { class HybridMLXSpec_cxx; }

// Include Swift defined types
#if __has_include("RNMLX-Swift.h")
// This header is generated by Xcode/Swift on every app build.
// If it cannot be found, make sure the Swift module's name (= podspec name) is actually "RNMLX".
#include "RNMLX-Swift.h"
// Same as above, but used when building with frameworks (`use_frameworks`)
#elif __has_include(<RNMLX/RNMLX-Swift.h>)
#include <RNMLX/RNMLX-Swift.h>
#else
#error RNMLX's autogenerated Swift header cannot be found! Make sure the Swift module's name (= podspec name) is actually "RNMLX", and try building the app first.
#endif
