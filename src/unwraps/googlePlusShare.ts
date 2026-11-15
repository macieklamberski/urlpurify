import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['plus.google.com']

const pathRegex = /^\/(?:u\/\d+\/)?share$/i

// Google+ share (plus.google.com/share?url=<target>, also /u/<n>/share). The service closed in 2019
// and the link now redirects to a shutdown notice. Opt-in: unwrapping returns the shared page, not
// the share form.
export const unwrapGooglePlusShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  return getParamTarget(url, 'url')
}
