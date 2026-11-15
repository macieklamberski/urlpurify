import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['digg.com', 'www.digg.com']

const pathRegex = /^\/(?:submit|share)\/?$/i

// Digg submit and share links (digg.com/submit?phase=2&url=<target>, /share?url=, on digg.com and
// www.digg.com). Opt-in: unwrapping returns the shared page, not the form that submits it.
export const unwrapDiggSubmit: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `title=`, `bodytext=` and `topic=` beside it are the story's text, never its target.
  return getParamTarget(url, 'url')
}
