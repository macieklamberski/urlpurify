import { isAnyOf, isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { readParamTarget } from '../utils.js'

const feedPrefixRegex = /^\/subscribe\/(?=https?:)/i

// Livedoor Reader subscribe link (reader.livedoor.com/subscribe/?url=<feed> and
// reader.livedoor.com/subscribe/<feed>). Opt-in in the subscribe intent group: the link adds the
// feed to a Livedoor Reader account, it never redirects to it.
export const unwrapLivedoorReader: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'reader.livedoor.com')) {
    return
  }

  if (isAnyOf(url.pathname, '/subscribe/')) {
    return readParamTarget(url, 'url')
  }

  return getPathTarget(url, feedPrefixRegex)
}
