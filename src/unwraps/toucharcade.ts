import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/link\/(.+)$/

// TouchArcade outbound link (toucharcade.com/link/<target>). Opt-in: the redirect probably adds
// TouchArcade's App Store affiliate token.
export const unwrapToucharcade: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'toucharcade.com')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the link's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
