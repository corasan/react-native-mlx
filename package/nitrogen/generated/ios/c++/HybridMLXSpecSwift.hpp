///
/// HybridMLXSpecSwift.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include "HybridMLXSpec.hpp"

// Forward declaration of `HybridMLXSpec_cxx` to properly resolve imports.
namespace RNMLX { class HybridMLXSpec_cxx; }

// Forward declaration of `MLXState` to properly resolve imports.
namespace margelo::nitro::rnmlx { struct MLXState; }

#include <string>
#include "MLXState.hpp"
#include <optional>
#include <NitroModules/Promise.hpp>

#include "RNMLX-Swift-Cxx-Umbrella.hpp"

namespace margelo::nitro::rnmlx {

  /**
   * The C++ part of HybridMLXSpec_cxx.swift.
   *
   * HybridMLXSpecSwift (C++) accesses HybridMLXSpec_cxx (Swift), and might
   * contain some additional bridging code for C++ <> Swift interop.
   *
   * Since this obviously introduces an overhead, I hope at some point in
   * the future, HybridMLXSpec_cxx can directly inherit from the C++ class HybridMLXSpec
   * to simplify the whole structure and memory management.
   */
  class HybridMLXSpecSwift: public virtual HybridMLXSpec {
  public:
    // Constructor from a Swift instance
    explicit HybridMLXSpecSwift(const RNMLX::HybridMLXSpec_cxx& swiftPart):
      HybridObject(HybridMLXSpec::TAG),
      _swiftPart(swiftPart) { }

  public:
    // Get the Swift part
    inline RNMLX::HybridMLXSpec_cxx& getSwiftPart() noexcept {
      return _swiftPart;
    }

  public:
    // Get memory pressure
    inline size_t getExternalMemorySize() noexcept override {
      return _swiftPart.getMemorySize();
    }

  public:
    // Properties
    inline std::string getOutput() noexcept override {
      auto __result = _swiftPart.getOutput();
      return __result;
    }
    inline void setOutput(const std::string& output) noexcept override {
      _swiftPart.setOutput(output);
    }
    inline double getTokensPerSecond() noexcept override {
      return _swiftPart.getTokensPerSecond();
    }
    inline void setTokensPerSecond(double tokensPerSecond) noexcept override {
      _swiftPart.setTokensPerSecond(std::forward<decltype(tokensPerSecond)>(tokensPerSecond));
    }
    inline double getDownloadProgress() noexcept override {
      return _swiftPart.getDownloadProgress();
    }
    inline void setDownloadProgress(double downloadProgress) noexcept override {
      _swiftPart.setDownloadProgress(std::forward<decltype(downloadProgress)>(downloadProgress));
    }
    inline std::string getCurrentFile() noexcept override {
      auto __result = _swiftPart.getCurrentFile();
      return __result;
    }
    inline void setCurrentFile(const std::string& currentFile) noexcept override {
      _swiftPart.setCurrentFile(currentFile);
    }
    inline std::string getError() noexcept override {
      auto __result = _swiftPart.getError();
      return __result;
    }
    inline void setError(const std::string& error) noexcept override {
      _swiftPart.setError(error);
    }
    inline MLXState getState() noexcept override {
      auto __result = _swiftPart.getState();
      return __result;
    }
    inline void setState(const MLXState& state) noexcept override {
      _swiftPart.setState(state);
    }

  public:
    // Methods
    inline std::shared_ptr<Promise<void>> load(const std::string& modelId) override {
      auto __result = _swiftPart.load(modelId);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<void>> generate(const std::string& prompt) override {
      auto __result = _swiftPart.generate(prompt);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }

  private:
    RNMLX::HybridMLXSpec_cxx _swiftPart;
  };

} // namespace margelo::nitro::rnmlx
