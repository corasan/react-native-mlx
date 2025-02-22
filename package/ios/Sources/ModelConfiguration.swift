//
//  ModelConfiguration.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation

public struct ModelConfiguration: Codable {
    public let blockSize: Int
    public let vocabSize: Int
    public let hiddenSize: Int
    public let numHeads: Int
    public let numLayers: Int
    public let rmsNorm: Bool
    public let rotaryDim: Int
    
    private enum CodingKeys: String, CodingKey {
        case blockSize = "block_size"
        case vocabSize = "vocab_size"
        case hiddenSize = "hidden_size"
        case numHeads = "num_heads"
        case numLayers = "num_layers"
        case rmsNorm = "rms_norm"
        case rotaryDim = "rotary_dim"
    }
}
