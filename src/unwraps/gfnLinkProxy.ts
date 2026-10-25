import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64, getParamValues } from '../utils.js'

// A forum root prefix, such as /forum/.
const pathRegex = /^(?:\/[^/]+)?\/redirect\/?$/

// GoodForNothing Link Proxy add-on for XenForo, its leaving page
// (<forum host>/redirect/?to=<base64>, with or without the slash after redirect). Each forum runs
// on its own host, so the exact path and a base64 http `to` are the guard, not the host.
export const unwrapGfnLinkProxy: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const raw = getParamValues(url, 'to').at(0)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
