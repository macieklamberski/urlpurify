import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = [
  'www.facebook.com',
  'facebook.com',
  'm.facebook.com',
  'pt-br.facebook.com',
  'de.facebook.com',
]

const sharerPathRegex = /^\/(?:sharer(?:\/sharer)?(?:\.php)?|share\.php)\/?$/i
const shareDialogPathRegex = /^\/dialog\/share\/?$/i
const feedDialogPathRegex = /^\/dialog\/feed\/?$/i

// Facebook share (facebook.com/sharer/sharer.php?u=<target>, also /sharer.php, /share.php, /sharer,
// legacy p[url]=, /dialog/share?href=, /dialog/feed?link=, never their redirect_uri). Opt-in:
// unwrapping returns the shared page, not the form that shares it.
export const unwrapFacebookShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  if (sharerPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'u') ?? getParamTarget(url, 'p[url]')
  }

  if (shareDialogPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'href')
  }

  if (feedDialogPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'link')
  }
}
