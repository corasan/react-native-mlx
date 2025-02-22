import Foundation
import ReactNativeMLX

@MainActor
class HybridMLX: HybridMLXSpec {
    func sum(num1: Double, num2: Double) throws -> Double {
        let rnmlx = RNMLX()
            rnmlx.load()
        return num1 + num2
    }
}
