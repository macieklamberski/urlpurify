import { decodePercent, isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['urldefense.proofpoint.com']

// Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=<encoded>). The encoded URL
// substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
export const unwrapProofpointV2 = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/v2/url')) {
      return
    }

    const raw = readParamTarget(url, 'u')

    if (!raw) {
      return
    }

    return decodePercent(raw.replaceAll('-', '%').replaceAll('_', '/'))
  },
})
