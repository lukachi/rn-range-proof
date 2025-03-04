import { NativeModule, requireNativeModule } from "expo";

declare class RangeProofModule extends NativeModule<{}> {
  genRangeProof: (
    v: number,
    r: Uint8Array,
    valBase: Uint8Array,
    randBase: Uint8Array,
    bits?: number,
  ) => Promise<Uint8Array<ArrayBufferLike>>;
  verifyRangeProof: (
    proof: Uint8Array,
    commitment: Uint8Array,
    valBase: Uint8Array,
    randBase: Uint8Array,
    bits: number,
  ) => Promise<boolean>;
  genBatchRangeProof: (
    vs: number[],
    rsBytes: Uint8Array,
    valBase: Uint8Array,
    randBase: Uint8Array,
    bits: number,
  ) => Promise<Uint8Array>;
  verifyBatchRangeProof: (
    proof: Uint8Array,
    commitmentsBytes: Uint8Array,
    valBase: Uint8Array,
    randBase: Uint8Array,
    bits: number,
  ) => Promise<boolean>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RangeProofModule>("RangeProof");
