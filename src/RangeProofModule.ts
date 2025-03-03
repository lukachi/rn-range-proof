import { NativeModule, requireNativeModule } from "expo";

declare class RangeProofModule extends NativeModule<{}> {
  genRangeProof: (
    v: number,
    r: Uint8Array,
    valBase: Uint8Array,
    randBase: Uint8Array,
    bits?: number,
  ) => Promise<Uint8Array<ArrayBufferLike>>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RangeProofModule>("RangeProof");
