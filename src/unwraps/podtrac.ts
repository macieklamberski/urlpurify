import { isHostOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const ptsHosts = ['www.podtrac.com', 'podtrac.com', 'www.podtrac.net', 'podtrac.net']

// Feeds also write a stray dot after the extension, `redirect.mp3./<target>`, or no slash before
// a target with a scheme, `redirect.mp3https://<target>`. Podtrac forwards both.
const dtsPrefixRegex = /^\/(?:pts\/)?redirect\.[a-z0-9]+?(?:\.?\/|(?=https?:))/i
const ptsPrefixRegex = /^\/pts\/redirect\.[a-z0-9]+?(?:\.?\/|(?=https?:))/i
const ptsQueryPathRegex = /^\/pts\/redirect\.[a-z0-9]+\/?$/i
const httpQueryRegex = /^\?https?:/i
// The first segment on play.podtrac.com is a free-form show slug, such as `npr-510253`.
const playPrefixRegex = /^\/[^/]*\//

// Podtrac download prefix: dts.podtrac.com/[pts/]redirect.<ext>/<target>, also on
// dts.podtrac.nytimes.com, [www.]podtrac.com and [www.]podtrac.net/pts/redirect.<ext>[/?]<target>,
// and play.podtrac.com/<show>/<target>. Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapPodtrac: UrlUnwrapper = createUnwrapper({
  hosts: ['dts.podtrac.nytimes.com', 'dts.podtrac.com', 'play.podtrac.com', ...ptsHosts],
  unwrap: (url) => {
    // The New York Times host answers 301 to https://dts.podtrac.com, so its targets get https.
    if (isHostOf(url, 'dts.podtrac.nytimes.com')) {
      return readPathTarget(url, dtsPrefixRegex)
    }

    if (isHostOf(url, 'dts.podtrac.com')) {
      return readPathTarget(url, dtsPrefixRegex, url.protocol)
    }

    if (isHostOf(url, 'play.podtrac.com')) {
      return readPathTarget(url, playPrefixRegex, url.protocol)
    }

    if (
      isHostOf(url, ptsHosts) &&
      ptsQueryPathRegex.test(url.pathname) &&
      httpQueryRegex.test(url.search)
    ) {
      return url.search.slice(1)
    }

    return readPathTarget(url, ptsPrefixRegex, url.protocol)
  },
})
