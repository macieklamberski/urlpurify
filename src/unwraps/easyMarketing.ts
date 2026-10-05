import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const pathRegex = /^\/trck\/eclick\/[0-9a-f]{32}$/

const hosts = ['partnerprogramm.otto.de', 'pvn.mediamarkt.de', 'pvn.saturn.de']

// easy Marketing (easy.M) private affiliate network click on a retailer's tracking host
// (pvn.saturn.de/trck/eclick/<id>?url=<target>, or ?url64fb=<base64 target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEasyMarketing: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('url')

  if (target) {
    return target
  }

  const encoded = url.searchParams.get('url64fb')

  if (!encoded) {
    return
  }

  const decoded = decodeBase64Url(encoded)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
