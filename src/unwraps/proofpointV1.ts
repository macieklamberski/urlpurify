import { decodeSegment } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const proofpointDomains = ['proofpoint.com', 'urldefense.com', 'urldefense.us']

// Proofpoint URLDefense v1 and v2 (urldefense.proofpoint.com/<version>/url?u=<encoded>), on
// proofpoint.com, urldefense.com, urldefense.us and their subdomains. The encoded URL substitutes
// `_` for `/` and `-` for `%`, then is URL-decoded.
export const createProofpointUnwrapper = (path: string): UrlUnwrapper => {
  const baseExtractor = createParamExtractor({
    domains: proofpointDomains,
    path,
    params: ['u'],
  })

  return (url) => {
    const raw = baseExtractor(url)

    if (!raw) {
      return
    }

    return decodeSegment(raw.replace(/-/g, '%').replace(/_/g, '/'))
  }
}

export const unwrapProofpointV1 = createProofpointUnwrapper('/v1/url')
