import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: 'urldefense.proofpoint.com',
  path: '/v1/url',
  params: ['u'],
})

// Proofpoint URLDefense v1 (urldefense.proofpoint.com/v1/url?u=<encoded>). The
// encoded URL substitutes `_` for `/` and `-` for `%`, then is URL-decoded.
export const unwrapProofpointV1: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  try {
    return decodeURIComponent(raw.replace(/-/g, '%').replace(/_/g, '/'))
  } catch {}
}
