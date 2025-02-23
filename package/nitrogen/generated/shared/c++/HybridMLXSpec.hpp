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

// Forward declaration of `MLXState` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct MLXState; }

#include <string>
#include "MLXState.hpp"
#include <NitroModules/Promise.hpp>

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
      virtual std::string getOutput() = 0;
      virtual void setOutput(const std::string& output) = 0;
      virtual double getTokensPerSecond() = 0;
      virtual void setTokensPerSecond(double tokensPerSecond) = 0;
      virtual double getDownloadProgress() = 0;
      virtual void setDownloadProgress(double downloadProgress) = 0;
      virtual std::string getCurrentFile() = 0;
      virtual void setCurrentFile(const std::string& currentFile) = 0;
      virtual std::string getError() = 0;
      virtual void setError(const std::string& error) = 0;
      virtual MLXState getState() = 0;
      virtual void setState(const MLXState& state) = 0;

    public:
      // Methods
      virtual std::shared_ptr<Promise<void>> load(const std::string& modelId) = 0;
      virtual std::shared_ptr<Promise<void>> generate(const std::string& prompt) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "MLX";
  };

} // namespace margelo::nitro::rnmlx
