///
/// ReactNativeMLXAutolinking.mm
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#import <Foundation/Foundation.h>
#import <NitroModules/HybridObjectRegistry.hpp>
#import "ReactNativeMLX-Swift-Cxx-Umbrella.hpp"
#import <type_traits>

#include "HybridMLXSpecSwift.hpp"

@interface ReactNativeMLXAutolinking : NSObject
@end

@implementation ReactNativeMLXAutolinking

+ (void) load {
  using namespace margelo::nitro;
  using namespace margelo::nitro::mlx;

  HybridObjectRegistry::registerHybridObjectConstructor(
    "MLX",
    []() -> std::shared_ptr<HybridObject> {
      std::shared_ptr<margelo::nitro::mlx::HybridMLXSpec> hybridObject = ReactNativeMLX::ReactNativeMLXAutolinking::createMLX();
      return hybridObject;
    }
  );
}

@end
