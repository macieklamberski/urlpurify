import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['www.linkedin.com', 'linkedin.com']

const pathRegex = /^\/(?:shareArticle|sharing\/share-offsite|cws\/share|share)\/?$/i

// LinkedIn share (linkedin.com/shareArticle?url=<page>, /sharing/share-offsite?url=,
// /cws/share?url= and /share?url=, each also with a trailing slash, on www. and bare
// linkedin.com). Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapLinkedinShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `title=`, `summary=` and `source=` beside it are text fields, even when one holds a url.
  return getParamTarget(url, 'url')
}
