import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget, percentDecode } from '../utils.js'

const pathRegex = /^\/allez\/[\w-]+$/
const encodedSchemeRegex = /^https?%3A/i

// Stay22 affiliate redirect (www.stay22.com/allez/<provider>?link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapStay22: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.stay22.com') || !pathRegex.test(url.pathname)) {
    return
  }

  let target = getParamTarget(url, 'link') ?? ''

  // Some links encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (isHttpUrl(target)) {
    return target
  }
}
