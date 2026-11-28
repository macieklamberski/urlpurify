import { decodeBase64Url } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

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
  /^us\d+-usndr\.com$/,
]

const pathRegex = /^\/(?:ru|ua)\/(?:mail|go2|eu1)_link_tracker$/i

// Unisender email click tracker (usndr.com/ru/mail_link_tracker?hash=<id>&url=<target>, also
// /go2_link_tracker and /eu1_link_tracker). Opt-in: unwrapping removes the sender's click count.
export const unwrapUnisender: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    // An unencoded nested tracker repeats `url`, so the first value is a stub and the last one is
    // the target.
    const value = readParamTarget(url, 'url', -1)

    if (!value) {
      return
    }

    // Some senders encode the target as base64url with `~` as the padding character. A url holds
    // a `:` or `.`, which base64 never does, so a url fails to decode and stays as written.
    return decodeBase64Url(value.replaceAll('~', '=')) ?? value
  },
})
