import { decodeBase64, hasQueryParam, isHttpUrl } from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

// The exit tracker at the blog root or under one blog folder.
const pathRegex = /^(?:\/[^/]+)?\/exit\.php$/i

// Serendipity blog engine exit tracker, on each blog's own host
// (<host>/[<blog>/]exit.php?url=<base64>&entry_id=<n>). The url param is a base64-encoded target
// URL, and entry_id names the post holding the link.
// Opt-in: unwrapping removes the site's count of which links get clicked.
export const unwrapSerendipity = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname) || !hasQueryParam(url, 'entry_id')) {
      return
    }

    const target = readDecodedParamTarget(url, 'url', decodeBase64)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
