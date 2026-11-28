import { decodePercent, isAnyOf } from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

const decodeTarget = (value: string): string => {
  return decodePercent(value.replaceAll('-', '%').replaceAll('_', '/'))
}

// Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=<encoded>). The encoded URL
// substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapProofpointV2 = createUnwrapper({
  hosts: 'urldefense.proofpoint.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/v2/url')) {
      return
    }

    return readDecodedParamTarget(url, 'u', decodeTarget)
  },
})
