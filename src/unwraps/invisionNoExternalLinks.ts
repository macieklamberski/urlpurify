import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues, percentDecode } from '../utils.js'

// A forum root prefix, such as /forum/ or /en/.
const pathRegex = /^(?:\/[^/]+)?\/redirect\/$/

const encodedSchemeRegex = /^https?%3A/i

// No External Links plugin for Invision Community, its redirect or leaving page
// (<forum host>/redirect/?to=<target>). Each forum runs on its own host, so the exact path and an
// http `to` are the guard, not the host.
export const unwrapInvisionNoExternalLinks: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  let target = getParamValues(url, 'to').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
