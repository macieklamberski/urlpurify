import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/allez\/[\w-]+$/

// Stay22 affiliate redirect (www.stay22.com/allez/<provider>?link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapStay22: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.stay22.com') || !pathRegex.test(url.pathname)) {
    return
  }

  const target = getParamTarget(url, 'link') ?? ''

  if (isHttpUrl(target)) {
    return target
  }
}
