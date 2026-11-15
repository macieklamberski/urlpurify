import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/submit(?:\.php)?$/i

const hosts = ['meneame.net', 'www.meneame.net']

// Menéame submit form (meneame.net/submit.php?url=<target>, also /submit, which /submit.php
// redirects to, on meneame.net and www.meneame.net). Opt-in: unwrapping returns the shared page,
// not the submit form.
export const unwrapMeneameSubmit: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `title=` beside it is the story's free-text title.
  return getParamTarget(url, 'url')
}
