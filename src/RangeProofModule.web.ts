import { registerWebModule, NativeModule } from 'expo';

import { RangeProofModuleEvents } from './RangeProof.types';

class RangeProofModule extends NativeModule<RangeProofModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(RangeProofModule);
