import { requireNativeView } from 'expo';
import * as React from 'react';

import { RangeProofViewProps } from './RangeProof.types';

const NativeView: React.ComponentType<RangeProofViewProps> =
  requireNativeView('RangeProof');

export default function RangeProofView(props: RangeProofViewProps) {
  return <NativeView {...props} />;
}
