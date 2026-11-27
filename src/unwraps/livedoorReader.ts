import { isAnyOf } from 'trousse'
import { createPathUnwrapper } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const feedPrefixRegex = /^\/subscribe\/(?=https?:)/i

const unwrapRawFeed = createPathUnwrapper({ hosts: 'reader.livedoor.com', prefix: feedPrefixRegex })

// Livedoor Reader subscribe link (reader.livedoor.com/subscribe/?url=<feed> and
// reader.livedoor.com/subscribe/<feed>). Opt-in in the subscribe intent group: the link adds the
// feed to a Livedoor Reader account, it never redirects to it.
export const unwrapLivedoorReader: UrlUnwrapper = createUnwrapper({
  hosts: 'reader.livedoor.com',
  ignoreLinkFragment: true, // A raw feed takes it through `unwrapRawFeed`
  unwrap: (url) => {
    if (isAnyOf(url.pathname, '/subscribe/')) {
      return readParamTarget(url, 'url')
    }

    return unwrapRawFeed(url)
  },
})
