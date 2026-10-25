import { createParamExtractor } from '../utils.js'

// Proofpoint URLDefense v1 (urldefense.proofpoint.com/v1/url?u=<target>), with the target
// percent-encoded as any query value.
export const unwrapProofpointV1 = createParamExtractor({
  hosts: 'urldefense.proofpoint.com',
  path: '/v1/url',
  params: ['u'],
})
