// Reexport the native module. On web, it will be resolved to RangeProofModule.web.ts
// and on native platforms to RangeProofModule.ts
export { default } from './RangeProofModule';
export { default as RangeProofView } from './RangeProofView';
export * from  './RangeProof.types';
