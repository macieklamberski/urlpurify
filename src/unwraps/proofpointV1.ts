import { createQueryUnwrapper } from '../utils.js'

// Proofpoint URLDefense v1 (urldefense.proofpoint.com/v1/url?u=<target>), with the target
// percent-encoded as any query value.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapProofpointV1 = createQueryUnwrapper({
  hosts: 'urldefense.proofpoint.com',
  path: '/v1/url',
  params: ['u'],
})
