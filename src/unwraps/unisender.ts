import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getParamTarget } from '../utils.js'

const hosts = [
  'emlblog.com',
  'emlpage.com',
  'emlstart.com',
  'emlway.com',
  'geteml.com',
  'link.emlmind.com',
  'link.posteml.com',
  'link.urait.ru', // A sender's own click domain
  'p11673.email-d.com',
  'redirlnk.com',
  'trk.emlbest.com',
  'ulist-man.com',
  'umail62.com',
  'us21.besteml.com',
  'usndr.com',
  /^us\d+-usndr\.com$/,
]

const pathRegex = /^\/(?:ru|ua)\/(?:mail|go2|eu1)_link_tracker$/

// Unisender email click tracker (usndr.com/ru/mail_link_tracker?hash=<id>&url=<target>, also
// /go2_link_tracker and /eu1_link_tracker). Opt-in: unwrapping removes the sender's click count.
export const unwrapUnisender: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  // An unencoded nested tracker repeats `url`, so the first value is a stub and the last one is
  // the target.
  const value = getParamTarget(url, 'url', -1)

  if (!value) {
    return
  }

  if (isHttpUrl(value)) {
    return value
  }

  // Some senders encode the target as base64url with `~` as the padding character.
  const decoded = decodeBase64Url(value.replace(/~/g, '='))

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
