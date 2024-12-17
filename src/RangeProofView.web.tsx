import * as React from 'react';

import { RangeProofViewProps } from './RangeProof.types';

export default function RangeProofView(props: RangeProofViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
