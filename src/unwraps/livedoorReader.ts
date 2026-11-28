import { isAnyOf } from 'trousse'
import { createPathUnwrapper } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['reader.livedoor.com']

const feedPrefixRegex = /^\/subscribe\/(?=https?:)/i

const extractRawFeed = createPathUnwrapper({
  hosts,
  prefix: feedPrefixRegex,
})

// Livedoor Reader subscribe link (reader.livedoor.com/subscribe/?url=<feed> and
// reader.livedoor.com/subscribe/<feed>).
// Opt-in: the link adds the feed to a Livedoor Reader account, it never redirects to it.
export const unwrapLivedoorReader = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // A raw feed takes it through `extractRawFeed`
  unwrap: (url) => {
    if (isAnyOf(url.pathname, '/subscribe/')) {
      return readParamTarget(url, 'url')
    }

    return extractRawFeed(url)
  },
})
