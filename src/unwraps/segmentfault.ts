import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  domains: 'segmentfault.com',
  path: '/',
  params: ['enc'],
})

// Segmentfault external link redirect (link.segmentfault.com/?enc=<base64>), on segmentfault.com
// and its subdomains. The enc param is a base64-encoded target URL.
export const unwrapSegmentfault: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
