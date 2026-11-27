import { decodeBase64 } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getDecodedParamTarget } from '../utils.js'

// A forum root prefix, such as /forum/.
const pathRegex = /^(?:\/[^/]+)?\/redirect\/?$/i

// GoodForNothing Link Proxy add-on for XenForo, its leaving page
// (<forum host>/redirect/?to=<base64>, with or without the slash after redirect). Each forum runs
// on its own host, so the exact path and a base64 http `to` are the guard, not the host.
export const unwrapGfnLinkProxy: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return getDecodedParamTarget(url, 'to', decodeBase64)
}
