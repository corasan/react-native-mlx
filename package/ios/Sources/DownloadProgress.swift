//
//  DownloadProgress.swift
//  ReactNativeMLX
//
//  Created by Henry on 2/21/25.
//

import Foundation

public struct DownloadProgress {
    public let fileName: String
    public let bytesDownloaded: Int64
    public let totalBytes: Int64
    public let percentage: Double
    
    public init(fileName: String, bytesDownloaded: Int64, totalBytes: Int64) {
        self.fileName = fileName
        self.bytesDownloaded = bytesDownloaded
        self.totalBytes = totalBytes
        self.percentage = totalBytes > 0 ? (Double(bytesDownloaded) / Double(totalBytes)) * 100 : 0
    }
}
