import Foundation
import ReactNativeMLX

class HybridMLX: HybridMLXSpec {
    func sum(num1: Double, num2: Double) throws -> Double {
        return ReactNativeMLX.sumNumbers(num1: num1, num2: num2)
    }
}
