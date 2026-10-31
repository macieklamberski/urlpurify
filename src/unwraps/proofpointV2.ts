import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractTarget = createParamExtractor({
  hosts: 'urldefense.proofpoint.com',
  path: '/v2/url',
  params: ['u'],
})

// Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=<encoded>). The encoded URL
// substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
export const unwrapProofpointV2: UrlUnwrapper = (url) => {
  const raw = extractTarget(url)

  if (!raw) {
    return
  }

  return decodePercent(raw.replaceAll('-', '%').replaceAll('_', '/'))
}
