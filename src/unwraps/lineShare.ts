import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const sharePaths = [
  { hosts: ['social-plugins.line.me'], path: /^\/lineit\/share$/i },
  { hosts: ['lineit.line.me'], path: /^\/share\/ui$/i },
  { hosts: ['timeline.line.me'], path: /^\/social-plugin\/share$/i },
]

// LINE share (social-plugins.line.me/lineit/share?url=<target>, and the older
// lineit.line.me/share/ui and timeline.line.me/social-plugin/share, which redirect to it). Opt-in:
// unwrapping returns the shared page, not the form that shares it.
export const unwrapLineShare: UrlUnwrapper = (url) => {
  const isSharePath = sharePaths.some(({ hosts, path }) => {
    return isHostOf(url, hosts) && isAnyOf(url.pathname, path)
  })

  if (!isSharePath) {
    return
  }

  // The `text=` beside it is the message, even when it holds only a url.
  return getParamTarget(url, 'url')
}
