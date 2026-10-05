import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const dtsPrefixRegex = /^\/(?:pts\/)?redirect\.[a-z0-9]+\//i
const ptsPrefixRegex = /^\/pts\/redirect\.[a-z0-9]+\//i
const ptsQueryPathRegex = /^\/pts\/redirect\.[a-z0-9]+\/?$/i
const httpQueryRegex = /^\?https?:/i

// Podtrac download measurement prefix (dts.podtrac.com/redirect.<ext>/<target>, also under /pts/,
// [www.]podtrac.com/pts/redirect.<ext>/<target> and www.podtrac.com/pts/redirect.<ext>?<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodtrac: UrlUnwrapper = (url) => {
  if (isHostOf(url, 'dts.podtrac.com')) {
    return getPathTarget(url, dtsPrefixRegex)
  }

  if (
    isHostOf(url, 'www.podtrac.com') &&
    ptsQueryPathRegex.test(url.pathname) &&
    httpQueryRegex.test(url.search)
  ) {
    return `${url.search.slice(1)}${url.hash}`
  }

  if (isHostOf(url, ['www.podtrac.com', 'podtrac.com'])) {
    return getPathTarget(url, ptsPrefixRegex)
  }
}
