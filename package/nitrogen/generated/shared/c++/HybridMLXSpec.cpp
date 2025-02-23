///
/// HybridMLXSpec.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "HybridMLXSpec.hpp"

namespace margelo::nitro::rnmlx {

  void HybridMLXSpec::loadHybridMethods() {
    // load base methods/properties
    HybridObject::loadHybridMethods();
    // load custom methods/properties
    registerHybrids(this, [](Prototype& prototype) {
      prototype.registerHybridGetter("output", &HybridMLXSpec::getOutput);
      prototype.registerHybridSetter("output", &HybridMLXSpec::setOutput);
      prototype.registerHybridGetter("tokensPerSecond", &HybridMLXSpec::getTokensPerSecond);
      prototype.registerHybridSetter("tokensPerSecond", &HybridMLXSpec::setTokensPerSecond);
      prototype.registerHybridGetter("downloadProgress", &HybridMLXSpec::getDownloadProgress);
      prototype.registerHybridSetter("downloadProgress", &HybridMLXSpec::setDownloadProgress);
      prototype.registerHybridGetter("currentFile", &HybridMLXSpec::getCurrentFile);
      prototype.registerHybridSetter("currentFile", &HybridMLXSpec::setCurrentFile);
      prototype.registerHybridGetter("error", &HybridMLXSpec::getError);
      prototype.registerHybridSetter("error", &HybridMLXSpec::setError);
      prototype.registerHybridGetter("state", &HybridMLXSpec::getState);
      prototype.registerHybridSetter("state", &HybridMLXSpec::setState);
      prototype.registerHybridMethod("load", &HybridMLXSpec::load);
      prototype.registerHybridMethod("generate", &HybridMLXSpec::generate);
    });
  }

} // namespace margelo::nitro::rnmlx
