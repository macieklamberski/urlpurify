import type { UrlUnwrapper } from '../types.js'
import { getParamValues, percentDecode } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i

// The target in the goto param of both 1C-Bitrix counters.
export const getBitrixTarget = (url: URL): string | undefined => {
  let target = getParamValues(url, 'goto').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  return target
}

// 1C-Bitrix statistics module outbound link counter on each site's own host
// (<host>/bitrix/redirect.php?event1=&event2=&event3=&goto=<target>).
export const unwrapBitrix: UrlUnwrapper = (url) => {
  if (url.pathname !== '/bitrix/redirect.php') {
    return
  }

  return getBitrixTarget(url)
}
