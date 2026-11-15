import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['share.diasporafoundation.org']

const paths = ['/', '/index', '/index/', '/index.html']

// diaspora* share form (share.diasporafoundation.org/?url=<page>, also /index, /index/ and
// /index.html). Opt-in: unwrapping returns the shared page, not the form that picks a pod to share
// it from.
export const unwrapDiasporaShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, paths)) {
    return
  }

  // The `title=` beside it is the post's text, even when it holds only a url.
  return getParamTarget(url, 'url')
}
