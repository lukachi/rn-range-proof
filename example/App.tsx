import { genRangeProof, verifyRangeProof } from "range-proof";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

const TEST_DATA = {
  amountChunks: [55n, 0n, 0n, 0n],
  decryptionKey: new Uint8Array([
    125, 84, 228, 96, 34, 152, 39, 245, 244, 8, 71, 150, 154, 13, 98, 26, 142,
    136, 68, 164, 63, 6, 49, 199, 149, 35, 25, 128, 101, 14, 225, 2,
  ]),
  valBase: new Uint8Array([
    226, 242, 174, 10, 106, 188, 78, 113, 168, 132, 169, 97, 197, 0, 81, 95, 88,
    227, 11, 106, 165, 130, 221, 141, 182, 166, 89, 69, 224, 141, 45, 118,
  ]),
  amountEncryptedDs: [
    new Uint8Array([
      42, 186, 111, 88, 176, 127, 42, 24, 24, 102, 236, 62, 178, 132, 27, 59,
      227, 183, 90, 241, 164, 213, 145, 240, 184, 124, 62, 108, 14, 145, 192,
      38,
    ]),
    new Uint8Array([
      226, 210, 44, 219, 113, 243, 220, 148, 83, 4, 51, 60, 156, 220, 163, 20,
      218, 216, 9, 115, 64, 17, 220, 201, 117, 45, 190, 43, 122, 199, 121, 25,
    ]),
    new Uint8Array([
      62, 215, 225, 94, 218, 55, 45, 211, 64, 165, 72, 234, 151, 144, 85, 215,
      190, 159, 18, 254, 230, 71, 121, 158, 218, 165, 14, 211, 86, 84, 182, 50,
    ]),
    new Uint8Array([
      178, 71, 74, 220, 119, 253, 31, 238, 94, 31, 156, 219, 68, 165, 18, 35,
      22, 204, 9, 162, 113, 25, 15, 100, 60, 95, 251, 218, 228, 246, 13, 25,
    ]),
  ],
};

const VERIFY_TEST_DATA = {
  commitment: [
    new Uint8Array([
      4, 226, 120, 146, 77, 86, 217, 68, 67, 94, 101, 38, 243, 226, 64, 8, 99,
      170, 118, 79, 92, 20, 82, 199, 217, 34, 82, 254, 166, 138, 60, 44,
    ]),
    new Uint8Array([
      136, 126, 228, 242, 8, 156, 138, 30, 35, 142, 203, 73, 159, 213, 39, 4,
      21, 196, 249, 31, 195, 222, 104, 173, 224, 20, 133, 0, 118, 22, 71, 3,
    ]),
    new Uint8Array([
      234, 33, 238, 117, 90, 165, 202, 210, 193, 37, 78, 203, 81, 13, 77, 3,
      154, 84, 113, 193, 135, 44, 69, 240, 31, 244, 71, 79, 34, 9, 135, 65,
    ]),
    new Uint8Array([
      130, 243, 177, 223, 136, 167, 180, 174, 234, 134, 36, 91, 181, 181, 195,
      168, 243, 200, 78, 86, 107, 106, 212, 145, 183, 75, 84, 187, 46, 157, 151,
      87,
    ]),
  ],
  valBase: new Uint8Array([
    226, 242, 174, 10, 106, 188, 78, 113, 168, 132, 169, 97, 197, 0, 81, 95, 88,
    227, 11, 106, 165, 130, 221, 141, 182, 166, 89, 69, 224, 141, 45, 118,
  ]),
  randBase: [
    new Uint8Array([
      42, 186, 111, 88, 176, 127, 42, 24, 24, 102, 236, 62, 178, 132, 27, 59,
      227, 183, 90, 241, 164, 213, 145, 240, 184, 124, 62, 108, 14, 145, 192,
      38,
    ]),
    new Uint8Array([
      226, 210, 44, 219, 113, 243, 220, 148, 83, 4, 51, 60, 156, 220, 163, 20,
      218, 216, 9, 115, 64, 17, 220, 201, 117, 45, 190, 43, 122, 199, 121, 25,
    ]),
    new Uint8Array([
      62, 215, 225, 94, 218, 55, 45, 211, 64, 165, 72, 234, 151, 144, 85, 215,
      190, 159, 18, 254, 230, 71, 121, 158, 218, 165, 14, 211, 86, 84, 182, 50,
    ]),
    new Uint8Array([
      178, 71, 74, 220, 119, 253, 31, 238, 94, 31, 156, 219, 68, 165, 18, 35,
      22, 204, 9, 162, 113, 25, 15, 100, 60, 95, 251, 218, 228, 246, 13, 25,
    ]),
  ],
};

const generate = () => {
  return Promise.all(
    TEST_DATA.amountChunks.map((chunk, i) => {
      return genRangeProof({
        v: chunk,
        r: TEST_DATA.decryptionKey,
        valBase: TEST_DATA.valBase,
        randBase: TEST_DATA.amountEncryptedDs[i],
      });
    }),
  );
};

const verify = async (proof: Uint8Array[]) => {
  const results = await Promise.all(
    proof.map((proof, i) =>
      verifyRangeProof({
        proof,
        commitment: VERIFY_TEST_DATA.commitment[i],
        valBase: VERIFY_TEST_DATA.valBase,
        randBase: VERIFY_TEST_DATA.randBase[i],
      }),
    ),
  );

  console.log("results", results);

  return results.every((isValid) => isValid);
};

export default function App() {
  const [proof, setProof] = useState<Uint8Array[]>();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={async () => {
          const generated = await generate();
          console.log(generated);
          setProof(generated.map((el) => el.proof));
        }}
      >
        <Text>Generate</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          console.log(await verify(proof!));
        }}
        disabled={!proof?.length}
      >
        <Text>Verify</Text>
      </Pressable>
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
