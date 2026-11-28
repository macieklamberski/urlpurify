import { decodeBase64, isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

// XenGenTr external link redirect add-on for XenForo, on each forum's own host
// (<host>/yonlendirme?to=<base64>). The to param is a base64-encoded target URL.
export const unwrapXengentr = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/yonlendirme')) {
      return
    }

    const target = readDecodedParamTarget(url, 'to', decodeBase64)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
