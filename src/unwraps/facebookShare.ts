import { createUnwrapper, readDecodedParamTarget, readParamTarget } from '../utils.js'

const sharerPathRegex = /^\/(?:sharer(?:\/sharer)?(?:\.php)?|share\.php)\/?$/i
const shareDialogPathRegex = /^\/dialog\/share\/?$/i
const linkDialogPathRegex = /^\/dialog\/(?:feed|send)\/?$/i
const hrefPrefixRegex = /^href=(?=https?:)/i

// One CMS writes its share link as `u=href=<target>`, the attribute name kept in the value.
const stripHrefPrefix = (value: string): string => {
  return value.replace(hrefPrefixRegex, '')
}

// Facebook share (facebook.com/sharer/sharer.php?u=<target>, /sharer.php, /share.php, /sharer,
// p[url]=, /dialog/share?href=, /dialog/feed and /dialog/send ?link=, never redirect_uri, on www.,
// bare, m., pt-br. and de.facebook.com).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapFacebookShare = createUnwrapper({
  hosts: [
    'facebook.com',
    'www.facebook.com',
    'm.facebook.com',
    'pt-br.facebook.com',
    'de.facebook.com',
  ],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (sharerPathRegex.test(url.pathname)) {
      return (
        readParamTarget(url, 'u') ??
        readDecodedParamTarget(url, 'u', stripHrefPrefix) ??
        readParamTarget(url, 'p[url]')
      )
    }

    if (shareDialogPathRegex.test(url.pathname)) {
      return readParamTarget(url, 'href')
    }

    if (linkDialogPathRegex.test(url.pathname)) {
      return readParamTarget(url, 'link')
    }
  },
})
