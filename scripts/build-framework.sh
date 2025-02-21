# This script builds the MLX framework for iOS
cd package/ios

xcodebuild archive \
  -scheme ReactNativeMLX \
  -destination "generic/platform=iOS" \
  -archivePath output/ReactNativeMLX \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

xcodebuild archive \
  -scheme ReactNativeMLX \
  -destination "generic/platform=iOS Simulator" \
  -archivePath output/ReactNativeMLX-simulator \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

rm -rf ReactNativeMLX.xcframework

xcodebuild -create-xcframework \
-framework output/ReactNativeMLX.xcarchive/Products/Library/Frameworks/ReactNativeMLX.framework \
-framework output/ReactNativeMLX-simulator.xcarchive/Products/Library/Frameworks/ReactNativeMLX.framework \
-output ReactNativeMLX.xcframework
