import { decodeBase64, isHttpUrl } from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

// A forum root prefix, such as /forum/.
const pathRegex = /^(?:\/[^/]+)?\/redirect\/?$/i

// GoodForNothing Link Proxy add-on for XenForo, its leaving page
// (<forum host>/redirect/?to=<base64>, with or without the slash after redirect). Each forum runs
// on its own host, so the exact path and a base64 http `to` are the guard, not the host.
export const unwrapGfnLinkProxy = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readDecodedParamTarget(url, 'to', decodeBase64)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
