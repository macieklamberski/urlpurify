import { decodeBase64Url } from 'trousse'
import { createUnwrapper, readDecodedTarget, readParamTarget } from '../utils.js'

const hosts = [
  'emlblog.com',
  'www.emlblog.com',
  'emlpage.com',
  'www.emlpage.com',
  'emlstart.com',
  'www.emlstart.com',
  'emlway.com',
  'www.emlway.com',
  'geteml.com',
  'www.geteml.com',
  'link.emlmind.com',
  'link.posteml.com',
  'link.urait.ru', // A sender's own click domain
  'p11673.email-d.com',
  'redirlnk.com',
  'www.redirlnk.com',
  'trk.emlbest.com',
  'ulist-man.com',
  'www.ulist-man.com',
  'umail62.com',
  'www.umail62.com',
  'us21.besteml.com',
  'usndr.com',
  'www.usndr.com',
  /^(?:www\.)?us\d+-usndr\.com$/,
]

const pathRegex = /^\/(?:ru|ua)\/(?:mail|go2|eu1)_link_tracker$/i

const decodeTarget = (value: string): string | undefined => {
  return decodeBase64Url(value.replaceAll('~', '='))
}

// Unisender email click tracker (usndr.com/ru/mail_link_tracker?hash=<id>&url=<target>, also
// /go2_link_tracker and /eu1_link_tracker).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapUnisender = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    // An unencoded nested tracker repeats `url`, so the first value is a stub and the last one is
    // the target. Some senders encode the target as base64url with `~` as the padding character.
    return (
      readParamTarget(url, 'url', { index: -1 }) ??
      readDecodedTarget(url, 'url', decodeTarget, { index: -1 })
    )
  },
})
