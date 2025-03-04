package expo.modules.rangeproof

import com.google.gson.Gson
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

data class RangeProofResult(
  val commitment: ByteArray,
  val proof: ByteArray
)

data class BatchRangeProofResult(
  val commitments: List<ByteArray>,
  val proof: ByteArray
)

class RangeProofModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('RangeProof')` in JavaScript.
    Name("RangeProof")

    AsyncFunction("genRangeProof") { v: Long, r: ByteArray, valBase: ByteArray, randBase: ByteArray, bits: Long ->
      println("genRangeProof")
      val result = rangeProof(v.toULong(), r, valBase, randBase, bits.toShort())

      val commitmentBytes = result.comm()
      val proofBytes = result.proof()

      val response = RangeProofResult(
        commitment = commitmentBytes,
        proof = proofBytes
      )

      val responseJsonString = Gson().toJson(response)

      return@AsyncFunction responseJsonString.toByteArray()
    }

    AsyncFunction("verifyRangeProof") { proof: ByteArray, commitment: ByteArray, valBase: ByteArray, randBase: ByteArray, bits: Long ->
      val result = verifyProof(proof, commitment, valBase, randBase, bits.toShort())

      return@AsyncFunction result
    }

    AsyncFunction("genBatchRangeProof") { v: List<Long>, rsBytes: ByteArray, valBase: ByteArray, randBase: ByteArray, bits: Long ->
      // rsBytes is a ByteArray of [32 * v.length] length
      // decode it to List<ByteArray> with 32 bytes each element
      val rs = mutableListOf<ByteArray>()
      for (i in v.indices) {
        val start = i * 32
        val end = start + 32
        val chunk = rsBytes.copyOfRange(start, end)
        rs.add(chunk)
      }

      val result = batchRangeProof(v.map { it.toULong() }, rs, valBase, randBase, bits.toShort())

      val commitmentBytes = result.comms()

      val proofBytes = result.proof()

      val response = BatchRangeProofResult(commitments = commitmentBytes, proof = proofBytes)

      val responseJsonString = Gson().toJson(response)

      // convert to ByteArray
      return@AsyncFunction responseJsonString.toByteArray()
    }

    AsyncFunction("verifyBatchRangeProof") { proof: ByteArray, commitmentsBytes: ByteArray, valBase: ByteArray, randBase: ByteArray, bits: Long ->
      val commitments = (0 until commitmentsBytes.size step 32).map { i ->
        val end = minOf(i + 32, commitmentsBytes.size)
        commitmentsBytes.copyOfRange(i, end)
      }

      val result = batchVerifyProof(proof, commitments, valBase, randBase, bits.toShort())

      return@AsyncFunction result
    }
  }
}
