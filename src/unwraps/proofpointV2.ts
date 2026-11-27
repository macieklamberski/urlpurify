import { decodePercent } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['urldefense.proofpoint.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  path: '/v2/url',
  params: ['u'],
})

// Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=<encoded>). The encoded URL
// substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
export const unwrapProofpointV2 = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const raw = extractTarget(url)

    if (!raw) {
      return
    }

    return decodePercent(raw.replaceAll('-', '%').replaceAll('_', '/'))
  },
})
