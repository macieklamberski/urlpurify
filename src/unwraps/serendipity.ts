import { decodeBase64, hasQueryParam } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getDecodedParamTarget } from '../utils.js'

// The exit tracker at the blog root or under one blog folder.
const pathRegex = /^(?:\/[^/]+)?\/exit\.php$/i

// Serendipity blog engine exit tracker, on each blog's own host
// (<host>/[<blog>/]exit.php?url=<base64>&entry_id=<n>). The url param is a base64-encoded target
// URL, and entry_id names the post holding the link.
export const unwrapSerendipity: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname) || !hasQueryParam(url, 'entry_id')) {
    return
  }

  return getDecodedParamTarget(url, 'url', decodeBase64)
}
