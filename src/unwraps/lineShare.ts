import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { readParamTarget } from '../utils.js'

const sharePaths = [
  {
    hosts: ['social-plugins.line.me'],
    path: /^\/(?:lineit\/share(?:\/ui)?|social-plugin\/share)$/i,
  },
  { hosts: ['lineit.line.me'], path: /^\/share(?:\/ui)?$/i },
  { hosts: ['timeline.line.me'], path: /^\/(?:lineit|social-plugin)\/share$/i },
]

// LINE share (social-plugins.line.me/lineit/share?url=<target>, and the spellings that redirect to
// it: social-plugins.line.me/lineit/share/ui and /social-plugin/share, lineit.line.me/share and
// /share/ui, timeline.line.me/lineit/share and /social-plugin/share). Opt-in: unwrapping returns
// the shared page, not the form that shares it.
export const unwrapLineShare: UrlUnwrapper = (url) => {
  const isSharePath = sharePaths.some(({ hosts, path }) => {
    return isHostOf(url, hosts) && isAnyOf(url.pathname, path)
  })

  if (!isSharePath) {
    return
  }

  // The `text=` beside it is the message, even when it holds only a url.
  return readParamTarget(url, 'url')
}
