import { decodePercent, isAnyOf } from 'trousse'
import { createUnwrapper, readDecodedTarget } from '../utils.js'

const hosts = ['urldefense.proofpoint.com']

const decodeTarget = (value: string): string => {
  return decodePercent(value.replaceAll('-', '%').replaceAll('_', '/'))
}

// Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=<encoded>). The encoded URL
// substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
export const unwrapProofpointV2 = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/v2/url')) {
      return
    }

    return readDecodedTarget(url, 'u', decodeTarget)
  },
})
