import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['plus.google.com']

const pathRegex = /^\/(?:u\/\d+\/)?share$/i

// Google+ share (plus.google.com/share?url=<target>, also /u/<n>/share). The service closed in 2019
// and the link now redirects to a shutdown notice. Opt-in: unwrapping returns the shared page, not
// the share form.
export const unwrapGooglePlusShare: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
