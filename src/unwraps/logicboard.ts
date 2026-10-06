import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

// A forum root prefix, such as /forum/ or /ru/forum/.
const pathRegex = /^(?:\/[^/]+){0,2}\/away\.php$/

const encodedSchemeRegex = /^https?%3A/i

// LogicBoard forum external link page (<forum host>/away.php?s=<target>). Each forum runs on its
// own host, so the exact path and an http `s` are the guard, not the host.
export const unwrapLogicboard: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  let target = getParamValues(url, 's').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
