//
//  RNMLXError.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/22/25.
//

import Foundation

public enum RNMLXError: Error {
    case modelLoadError(String)
    case downloadError(String)
    case configError(String)
}
