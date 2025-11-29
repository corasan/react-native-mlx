# This script builds the MLX framework for iOS
cd package/ios

xcodebuild archive \
  -scheme MLXReactNative \
  -destination "generic/platform=iOS" \
  -archivePath output/MLXReactNative \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

xcodebuild archive \
  -scheme MLXReactNative \
  -destination "generic/platform=iOS Simulator" \
  -archivePath output/MLXReactNative-simulator \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

rm -rf MLXReactNative.xcframework

xcodebuild -create-xcframework \
-framework output/MLXReactNative.xcarchive/Products/Library/Frameworks/MLXReactNative.framework \
-framework output/MLXReactNative-simulator.xcarchive/Products/Library/Frameworks/MLXReactNative.framework \
-output MLXReactNative.xcframework
