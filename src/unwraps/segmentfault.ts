import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

// Segmentfault external link redirect (link.segmentfault.com/?enc=<base64>). The enc param is a
// base64-encoded target URL.
export const unwrapSegmentfault: UrlUnwrapper = createUnwrapper({
  hosts: 'link.segmentfault.com',
  unwrap: (url) => {
    if (url.pathname !== '/') {
      return
    }

    return getBase64Target(url, 'enc')
  },
})
