import { decodeBase64Url } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target, getParamTarget } from '../utils.js'

const pathRegex = /^\/trck\/eclick\/[0-9a-f]{32}$/i

const hosts = ['partnerprogramm.otto.de', 'pvn.mediamarkt.de', 'pvn.saturn.de']

// easy Marketing (easy.M) private affiliate network click on a retailer's tracking host
// (pvn.saturn.de/trck/eclick/<id>?url=<target>, or ?url64fb=<base64 target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEasyMarketing: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = getParamTarget(url, 'url')

    if (target) {
      return target
    }

    return getBase64Target(url, 'url64fb', decodeBase64Url)
  },
})
