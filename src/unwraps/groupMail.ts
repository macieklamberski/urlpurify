import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/[A-Za-z0-9]+\/e=[^/]*\/(https?:\/.*)$/i

// GroupMail email click tracker (lnk.ie/<code>/e=<recipient email>/<target>). The target's own
// query and fragment are the url's. Opt-in: unwrapping removes the sender's click count.
export const unwrapGroupMail: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'lnk.ie')) {
    return
  }

  const match = url.pathname.match(pathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
