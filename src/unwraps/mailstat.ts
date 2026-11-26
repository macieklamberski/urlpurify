import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The target follows the message and link ids unencoded, often with a single slash after the
// scheme.
const clickPathRegex =
  /^\/tr\/(?:t\/[a-z0-9]+\/[a-z0-9]+|t2\/[a-z0-9]+\/[a-z0-9]+\/\d+)\/(https?:.*)$/i

// Mailstat email click tracker (mailstat.us/tr/t/<id>/<link>/<target>, also
// /tr/t2/<id>/<id>/<n>/<target>). Opt-in: unwrapping removes the sender's click count.
export const unwrapMailstat: UrlUnwrapper = createUnwrapper('mailstat.us', isHostOf, (url) => {
  const match = clickPathRegex.exec(url.pathname)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
})
