# This script builds the MLX framework for iOS
cd package/ios/RNMLX

xcodebuild archive \
  -scheme RNMLX \
  -destination "generic/platform=iOS" \
  -archivePath ../output/RNMLX \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

xcodebuild archive \
  -scheme RNMLX \
  -destination "generic/platform=iOS Simulator" \
  -archivePath ../output/RNMLX-simulator \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

xcodebuild -create-xcframework \
-framework ../output/RNMLX.xcarchive/Products/Library/Frameworks/RNMLX.framework \
-framework ../output/RNMLX-simulator.xcarchive/Products/Library/Frameworks/RNMLX.framework \
-output ../RNMLX.xcframework