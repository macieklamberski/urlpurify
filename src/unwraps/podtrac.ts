import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// Feeds also write a stray dot after the extension, `redirect.mp3./<target>`, or no slash before
// a target with a scheme, `redirect.mp3https://<target>`. Podtrac forwards both.
const dtsPrefixRegex = /^\/(?:pts\/)?redirect\.[a-z0-9]+?(?:\.?\/|(?=https?:))/i
const ptsPrefixRegex = /^\/pts\/redirect\.[a-z0-9]+?(?:\.?\/|(?=https?:))/i
const ptsQueryPathRegex = /^\/pts\/redirect\.[a-z0-9]+\/?$/i
const httpQueryRegex = /^\?https?:/i
// The first segment on play.podtrac.com is a free-form show slug, such as `npr-510253`.
const playPrefixRegex = /^\/[^/]*\//

// Podtrac download measurement prefix (dts.podtrac.com/redirect.<ext>/<target>, also under /pts/
// and on dts.podtrac.nytimes.com, [www.]podtrac.com/pts/redirect.<ext>/<target>, also on
// www.podtrac.net, www.podtrac.com/pts/redirect.<ext>?<target> and play.podtrac.com/<show>/<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodtrac: UrlUnwrapper = (url) => {
  // The New York Times host answers 301 to https://dts.podtrac.com, so its targets get https.
  if (isHostOf(url, 'dts.podtrac.nytimes.com')) {
    return getPathTarget(url, dtsPrefixRegex)
  }

  if (isHostOf(url, 'dts.podtrac.com')) {
    return getPathTarget(url, dtsPrefixRegex, url.protocol)
  }

  if (isHostOf(url, 'play.podtrac.com')) {
    return getPathTarget(url, playPrefixRegex, url.protocol)
  }

  if (
    isHostOf(url, 'www.podtrac.com') &&
    ptsQueryPathRegex.test(url.pathname) &&
    httpQueryRegex.test(url.search)
  ) {
    return `${url.search.slice(1)}${url.hash}`
  }

  if (isHostOf(url, ['www.podtrac.com', 'podtrac.com', 'www.podtrac.net'])) {
    return getPathTarget(url, ptsPrefixRegex, url.protocol)
  }
}
