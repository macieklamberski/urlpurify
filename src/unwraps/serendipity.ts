import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64 } from '../utils.js'

// The exit tracker at the blog root or under one blog folder.
const pathRegex = /^(?:\/[^/]+)?\/exit\.php$/

// Serendipity blog engine exit tracker, on each blog's own host
// (<host>/[<blog>/]exit.php?url=<base64>&entry_id=<n>). The url param is a base64-encoded target
// URL, and entry_id names the post holding the link.
export const unwrapSerendipity: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname) || !url.searchParams.has('entry_id')) {
    return
  }

  const raw = url.searchParams.get('url')

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
