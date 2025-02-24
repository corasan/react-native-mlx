///
/// HybridMLXSpec.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/HybridObject.hpp>)
#include <NitroModules/HybridObject.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `ModelState` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct ModelState; }
// Forward declaration of `RNMLXEventTypes` to properly resolve imports.
namespace margelo::nitro::rnmlx { enum class RNMLXEventTypes; }
// Forward declaration of `TokenGenerationEvent` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct TokenGenerationEvent; }
// Forward declaration of `ModelLoadProgressEvent` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct ModelLoadProgressEvent; }
// Forward declaration of `StateChangeEvent` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct StateChangeEvent; }
// Forward declaration of `ErrorEvent` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct ErrorEvent; }
// Forward declaration of `GenerationCompleteEvent` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct GenerationCompleteEvent; }

#include <string>
#include "ModelState.hpp"
#include <NitroModules/Promise.hpp>
#include "RNMLXEventTypes.hpp"
#include <functional>
#include <variant>
#include "TokenGenerationEvent.hpp"
#include "ModelLoadProgressEvent.hpp"
#include "StateChangeEvent.hpp"
#include "ErrorEvent.hpp"
#include "GenerationCompleteEvent.hpp"

namespace margelo::nitro::rnmlx {

  using namespace margelo::nitro;

  /**
   * An abstract base class for `MLX`
   * Inherit this class to create instances of `HybridMLXSpec` in C++.
   * You must explicitly call `HybridObject`'s constructor yourself, because it is virtual.
   * @example
   * ```cpp
   * class HybridMLX: public HybridMLXSpec {
   * public:
   *   HybridMLX(...): HybridObject(TAG) { ... }
   *   // ...
   * };
   * ```
   */
  class HybridMLXSpec: public virtual HybridObject {
    public:
      // Constructor
      explicit HybridMLXSpec(): HybridObject(TAG) { }

      // Destructor
      ~HybridMLXSpec() override = default;

    public:
      // Properties
      virtual std::string getResponse() = 0;
      virtual void setResponse(const std::string& response) = 0;
      virtual double getTokensPerSecond() = 0;
      virtual void setTokensPerSecond(double tokensPerSecond) = 0;
      virtual double getDownloadProgress() = 0;
      virtual void setDownloadProgress(double downloadProgress) = 0;
      virtual std::string getCurrentFile() = 0;
      virtual void setCurrentFile(const std::string& currentFile) = 0;
      virtual std::string getError() = 0;
      virtual void setError(const std::string& error) = 0;
      virtual ModelState getState() = 0;
      virtual void setState(const ModelState& state) = 0;

    public:
      // Methods
      virtual std::shared_ptr<Promise<void>> load(const std::string& modelId) = 0;
      virtual std::shared_ptr<Promise<void>> generate(const std::string& prompt) = 0;
      virtual std::string addEventListener(RNMLXEventTypes eventType, const std::function<void(const std::variant<TokenGenerationEvent, ModelLoadProgressEvent, StateChangeEvent, ErrorEvent, GenerationCompleteEvent>& /* event */)>& listener) = 0;
      virtual void removeEventListener(RNMLXEventTypes eventType, const std::string& listenerId) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "MLX";
  };

} // namespace margelo::nitro::rnmlx
