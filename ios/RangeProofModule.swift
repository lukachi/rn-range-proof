import ExpoModulesCore

struct RangeProofResult: Codable {
    let proof: [UInt8]
    let commitment: [UInt8]
}

struct BatchRangeProofResult: Codable {
    let proof: [UInt8]
    let commitments: [Data]
}

public class RangeProofModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('RangeProof')` in JavaScript.
    Name("RangeProof")

    AsyncFunction("genRangeProof") { (
        v: UInt64,
        r: Data,
        valBase: Data,
        randBase: Data,
        numBits: Int16
    ) in
      let result = try rangeProof(
        v: v,
        r: r,
        valBase: valBase,
        randBase: randBase,
        numBits: numBits
      )
      
      let comm = result.comm()
      print("Comm length: \(comm.count), Data: \(comm)")

      let proof = result.proof()
      print("Proof length: \(proof.count), Data: \(proof)")

      let rangeProofResult = RangeProofResult(
          proof: Array(proof),
          commitment: Array(comm)
      )

      let resultData = try JSONEncoder().encode(rangeProofResult)
      print("Encoded Result: \(String(data: resultData, encoding: .utf8)!)")

      return resultData
    }

      AsyncFunction("verifyRangeProof") { (proof: Data, comm: Data, valBase: Data, randBase: Data, numBits: Int16) in
      return try verifyProof(
        proof: proof,
        comm: comm,
        valBase: valBase,
        randBase: randBase,
        numBits: numBits
      )
    }
      
      AsyncFunction("genBatchRangeProof") { (
          v: [UInt64],
          rs: [Data],
          valBase: Data,
          randBase: Data,
          numBits: Int16
      ) in
        let result = try batchRangeProof(
          v: v,
          rs: rs,
          valBase: valBase,
          randBase: randBase,
          numBits: numBits
        )
        
        let comms = result.comms()
        print("Comm length: \(comms.count), Data: \(comms)")

        let proof = result.proof()
        print("Proof length: \(proof.count), Data: \(proof)")

        let rangeProofResult = BatchRangeProofResult(
            proof: Array(proof),
            commitments: comms
        )

        let resultData = try JSONEncoder().encode(rangeProofResult)
        print("Encoded Result: \(String(data: resultData, encoding: .utf8)!)")

        return resultData
      }

        AsyncFunction("verifyBatchRangeProof") { (proof: Data, comms: [Data], valBase: Data, randBase: Data, numBits: Int16) in
        return try batchVerifyProof(
          proof: proof,
          comm: comms,
          valBase: valBase,
          randBase: randBase,
          numBits: numBits
        )
      }
  }
}
