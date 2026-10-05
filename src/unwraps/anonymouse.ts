import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The proxy script, also in its German edition, then the target.
const pathRegex = /^\/cgi-bin\/anon-www(?:_de)?\.cgi\/(.+)$/

// Anonymouse web proxy (anonymouse.org/cgi-bin/anon-www.cgi/<target>, also anon-www_de.cgi).
// Opt-in: the proxy serves the page anonymously, which a reader may choose on purpose.
export const unwrapAnonymouse: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'anonymouse.org')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the proxy URL's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
