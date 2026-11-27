import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const paths = ['/fan_reach/pt', '/c/fan_reach/pt', '/controller/fan_reach/pt']

const hosts = ['www.rvrb.me', 'www.reverbnation.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url', 'rn_url'],
})

// ReverbNation FanReach newsletter click tracker (www.rvrb.me/fan_reach/pt?eid=<id>&url=<target>,
// also rn_url, and www.reverbnation.com, where rvrb.me forwards), and its older paths
// /c/fan_reach/pt and /controller/fan_reach/pt, which forwarded the same way until 2021. Opt-in:
// unwrapping removes the artist's click count.
export const unwrapReverbnation: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    return extractTarget(url)
  },
})
