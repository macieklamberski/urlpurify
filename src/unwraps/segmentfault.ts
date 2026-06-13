import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: 'link.segmentfault.com',
  params: ['enc'],
})

// Segmentfault external link redirect (link.segmentfault.com/?enc=<base64>).
// The enc param is a base64-encoded target URL.
export const unwrapSegmentfault: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && (decoded.startsWith('http://') || decoded.startsWith('https://'))) {
    return decoded
  }
}
