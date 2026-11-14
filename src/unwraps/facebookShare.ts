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
const linkDialogPathRegex = /^\/dialog\/(?:feed|send)\/?$/i

// Facebook share (facebook.com/sharer/sharer.php?u=<target>, /sharer.php, /share.php, /sharer,
// p[url]=, /dialog/share?href=, /dialog/feed and /dialog/send ?link=, never redirect_uri, on www.,
// bare, m., pt-br. and de.facebook.com). Opt-in: unwrapping returns the shared page, not the form.
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

  if (linkDialogPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'link')
  }
}
