import { decodeBase64Url, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target } from '../utils.js'

const hosts = ['stats.newswire.com', 'stats.nwe.io', 'stats.mediadboutreach.com']

// Newswire release and email click tracker (stats.newswire.com/x/html?final=<base64url>&sig=…,
// also stats.nwe.io and stats.mediadboutreach.com).
export const unwrapNewswire: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, '/x/html')) {
    return
  }

  return getBase64Target(url, 'final', decodeBase64Url)
}
