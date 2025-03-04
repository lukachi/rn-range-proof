import {
  genBatchRangeProof,
  genRangeProof,
  verifyBatchRangeProof,
  verifyRangeProof,
} from "range-proof";
import { useState } from "react";
import { Button, SafeAreaView } from "react-native";

const TEST_DATA = {
  amountChunks: [100n, 65535n, 65535n, 65535n, 0n, 0n, 0n, 0n],
  rs: [
    new Uint8Array([
      156, 109, 62, 196, 154, 157, 21, 68, 90, 114, 172, 209, 197, 139, 143, 61,
      160, 58, 39, 102, 219, 171, 91, 239, 231, 110, 102, 68, 251, 78, 229, 0,
    ]),
    new Uint8Array([
      226, 255, 163, 21, 112, 110, 162, 20, 221, 143, 164, 105, 231, 33, 193,
      148, 18, 80, 162, 29, 129, 255, 120, 26, 185, 11, 14, 203, 58, 117, 11, 1,
    ]),
    new Uint8Array([
      211, 135, 180, 67, 78, 113, 51, 3, 30, 106, 175, 250, 253, 98, 107, 107,
      107, 121, 18, 79, 184, 72, 112, 110, 110, 43, 88, 237, 40, 115, 230, 6,
    ]),
    new Uint8Array([
      56, 81, 75, 153, 26, 80, 124, 115, 117, 11, 158, 226, 43, 22, 118, 212,
      25, 35, 141, 99, 176, 184, 129, 64, 95, 152, 221, 31, 146, 30, 124, 15,
    ]),
    new Uint8Array([
      14, 2, 23, 100, 172, 102, 32, 214, 40, 175, 237, 119, 212, 103, 134, 94,
      56, 231, 33, 141, 255, 144, 46, 225, 135, 191, 49, 99, 200, 179, 55, 15,
    ]),
    new Uint8Array([
      6, 141, 188, 12, 66, 106, 33, 133, 111, 176, 43, 67, 187, 180, 73, 117,
      141, 252, 16, 34, 219, 237, 107, 148, 6, 46, 121, 189, 220, 189, 23, 15,
    ]),
    new Uint8Array([
      77, 236, 7, 237, 246, 153, 229, 89, 79, 53, 191, 120, 201, 221, 49, 168,
      233, 183, 255, 203, 68, 93, 210, 76, 15, 214, 104, 59, 171, 1, 28, 12,
    ]),
    new Uint8Array([
      111, 233, 138, 35, 138, 32, 76, 127, 96, 165, 119, 52, 156, 0, 140, 60,
      12, 122, 15, 203, 194, 112, 17, 92, 82, 51, 120, 157, 63, 0, 242, 14,
    ]),
  ],
  valBase: new Uint8Array([
    226, 242, 174, 10, 106, 188, 78, 113, 168, 132, 169, 97, 197, 0, 81, 95, 88,
    227, 11, 106, 165, 130, 221, 141, 182, 166, 89, 69, 224, 141, 45, 118,
  ]),
  rand_base: new Uint8Array([
    140, 146, 64, 180, 86, 169, 230, 220, 101, 195, 119, 161, 4, 141, 116, 95,
    148, 160, 140, 219, 127, 68, 203, 205, 123, 70, 243, 64, 72, 135, 17, 52,
  ]),
  num_bits: 16,
};

const generate = () => {
  try {
    return Promise.all(
      TEST_DATA.amountChunks.map((chunk, i) => {
        return genRangeProof({
          v: chunk,
          r: TEST_DATA.rs[i],
          valBase: TEST_DATA.valBase,
          randBase: TEST_DATA.rand_base,
        });
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

const verify = async (proof: Uint8Array[], commitments: Uint8Array[]) => {
  try {
    const results = await Promise.all(
      proof.map((proof, i) =>
        verifyRangeProof({
          proof,
          commitment: commitments[i],
          valBase: TEST_DATA.valBase,
          randBase: TEST_DATA.rand_base,
        }),
      ),
    );

    return results.every((isValid) => isValid);
  } catch (error) {
    console.error(error);
  }

  return false;
};

const generateBatch = async () => {
  try {
    return await genBatchRangeProof({
      vs: TEST_DATA.amountChunks,
      rs: TEST_DATA.rs,
      valBase: TEST_DATA.valBase,
      randBase: TEST_DATA.rand_base,
      bits: 16,
    });
  } catch (error) {
    console.error(error);
  }
};

const verifyBatch = async (proof: Uint8Array, commitments: Uint8Array[]) => {
  return verifyBatchRangeProof({
    proof,
    comms: commitments,
    valBase: TEST_DATA.valBase,
    randBase: TEST_DATA.rand_base,
    numBits: 16,
  });
};

export default function App() {
  const [proof, setProof] = useState<Uint8Array[]>();
  const [commitments, setCommitments] = useState<Uint8Array[]>();

  const [batchProof, setBatchProof] = useState<Uint8Array>();
  const [batchCommitments, setBatchCommitments] = useState<Uint8Array[]>();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        },
      ]}
    >
      <Button
        title="Generate"
        onPress={async () => {
          const generated = await generate();
          console.log(generated);
          setProof(generated?.map((el) => el.proof));
          setCommitments(generated?.map((el) => el.commitment));
        }}
      />
      <Button
        title="Verify"
        onPress={async () => {
          console.log(await verify(proof!, commitments!));
        }}
        disabled={!proof?.length}
      />

      <Button
        title="Generate Batch"
        onPress={async () => {
          const generated = await generateBatch();
          console.log(generated);
          setBatchProof(generated?.proof);
          setBatchCommitments(generated?.commitments);
        }}
      />
      <Button
        title="Verify Batch"
        onPress={async () => {
          console.log(await verifyBatch(batchProof!, batchCommitments!));
        }}
        disabled={!batchProof?.length}
      />
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
