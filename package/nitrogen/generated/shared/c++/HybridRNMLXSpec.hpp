///
/// HybridRNMLXSpec.hpp
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



#include <string>

namespace margelo::nitro::mlx {

  using namespace margelo::nitro;

  /**
   * An abstract base class for `RNMLX`
   * Inherit this class to create instances of `HybridRNMLXSpec` in C++.
   * You must explicitly call `HybridObject`'s constructor yourself, because it is virtual.
   * @example
   * ```cpp
   * class HybridRNMLX: public HybridRNMLXSpec {
   * public:
   *   HybridRNMLX(...): HybridObject(TAG) { ... }
   *   // ...
   * };
   * ```
   */
  class HybridRNMLXSpec: public virtual HybridObject {
    public:
      // Constructor
      explicit HybridRNMLXSpec(): HybridObject(TAG) { }

      // Destructor
      ~HybridRNMLXSpec() override = default;

    public:
      // Properties
      

    public:
      // Methods
      virtual std::string sum(const std::string& str1, const std::string& str2) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "RNMLX";
  };

} // namespace margelo::nitro::mlx
