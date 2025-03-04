import { Buffer } from "buffer";

import RangeProofModule from "./RangeProofModule";

export async function genRangeProof(opts: {
  v: bigint;
  r: Uint8Array;
  valBase: Uint8Array;
  randBase: Uint8Array;
  bits?: number;
}): Promise<{
  proof: Uint8Array;
  commitment: Uint8Array;
}> {
  const result = await RangeProofModule.genRangeProof(
    +opts.v.toString(),
    new Uint8Array(opts.r),
    new Uint8Array(opts.valBase),
    new Uint8Array(opts.randBase),
    opts.bits || 32,
  );

  const jsonStringified = Buffer.from(result).toString();

  const response = JSON.parse(jsonStringified);

  return {
    proof: new Uint8Array(response.proof),
    commitment: new Uint8Array(response.commitment),
  };
}

export async function verifyRangeProof(opts: {
  proof: Uint8Array;
  commitment: Uint8Array;
  valBase: Uint8Array;
  randBase: Uint8Array;
  bits?: number;
}): Promise<boolean> {
  return await RangeProofModule.verifyRangeProof(
    new Uint8Array(opts.proof),
    new Uint8Array(opts.commitment),
    new Uint8Array(opts.valBase),
    new Uint8Array(opts.randBase),
    opts.bits || 32,
  );
}

export async function genBatchRangeProof(opts: {
  vs: bigint[];
  rs: Uint8Array<ArrayBuffer>[];
  valBase: Uint8Array<ArrayBuffer>;
  randBase: Uint8Array<ArrayBuffer>;
  bits: number;
}): Promise<{
  proof: Uint8Array;
  commitments: Uint8Array[];
}> {
  if (opts.rs.length !== opts.vs.length)
    throw new TypeError("rs and vs must be of the same length");

  const result = await RangeProofModule.genBatchRangeProof(
    opts.vs.map((el) => +el.toString()),
    new Uint8Array(opts.rs.map((el) => Array.from(el)).flat()),
    new Uint8Array(opts.valBase),
    new Uint8Array(opts.randBase),
    opts.bits,
  );

  const jsonStringified = Buffer.from(result).toString();

  const response = JSON.parse(jsonStringified);

  return {
    proof: new Uint8Array(response.proof),
    commitments: response.commitments.map((el) => new Uint8Array(el)),
  };
}

export async function verifyBatchRangeProof(opts: {
  proof: Uint8Array;
  comms: Uint8Array[];
  valBase: Uint8Array;
  randBase: Uint8Array;
  numBits: number;
}): Promise<boolean> {
  return await RangeProofModule.verifyBatchRangeProof(
    new Uint8Array(opts.proof),
    new Uint8Array(opts.comms.map((el) => Array.from(el)).flat()),
    new Uint8Array(opts.valBase),
    new Uint8Array(opts.randBase),
    opts.numBits,
  );
}
