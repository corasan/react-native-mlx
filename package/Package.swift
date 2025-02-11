// swift-tools-version: 5.7

import PackageDescription

let package = Package(
    name: "HybridRNMLX",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "HybridRNMLX",
            targets: ["HybridRNMLX"]
        ),
    ],
    dependencies: [
      .package(url: "https://github.com/ml-explore/mlx-swift", from: "0.10.0")
    ],
    targets: [
        .target(
            name: "HybridRNMLX",
            dependencies: [
                .product(name: "MLXLoader", package: "mlx-swift"),
            ],
            path: "ios"
        )
    ]
)