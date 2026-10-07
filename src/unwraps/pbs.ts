import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// PBS resolves a target without a scheme as a path on www.pbs.org.
const redirPrefixRegex = /^\/(?:[\w-]+\/)+redir\/(?=https?:\/)/

// PBS download and click counter (www.pbs.org/<show path>/redir/<target>), such as
// /wgbh/nova/rss/podcast/redir/ on podcast enclosures. The target keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes PBS's download counts.
export const unwrapPbs: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.pbs.org')) {
    return
  }

  return getPathTarget(url, redirPrefixRegex)
}
