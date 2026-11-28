import { decodeBase64Url } from 'trousse'
import { createUnwrapper, readDecodedParamTarget, readParamTarget } from '../utils.js'

const pathRegex = /^\/trck\/eclick\/[0-9a-f]{32}$/i

// easy Marketing (easy.M) private affiliate network click on a retailer's tracking host
// (pvn.saturn.de/trck/eclick/<id>?url=<target>, or ?url64fb=<base64 target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapEasyMarketing = createUnwrapper({
  hosts: ['partnerprogramm.otto.de', 'pvn.mediamarkt.de', 'pvn.saturn.de'],
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (target) {
      return target
    }

    return readDecodedParamTarget(url, 'url64fb', decodeBase64Url)
  },
})
