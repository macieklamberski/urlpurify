import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getParamValues } from '../utils.js'

const hosts = ['stats.newswire.com', 'stats.nwe.io', 'stats.mediadboutreach.com']

// Newswire release and email click tracker (stats.newswire.com/x/html?final=<base64url>&sig=…,
// also stats.nwe.io and stats.mediadboutreach.com).
export const unwrapNewswire: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, hosts) || url.pathname !== '/x/html') {
    return
  }

  const value = getParamValues(url, 'final').at(0)

  if (!value) {
    return
  }

  const decoded = decodeBase64Url(value)

  if (!decoded || !isHttpUrl(decoded)) {
    return
  }

  return decoded
}
