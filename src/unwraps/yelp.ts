import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const redirectPaths = ['/biz_redir', '/redir']

const hosts = ['www.yelp.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Yelp outbound link redirect (www.yelp.com/biz_redir?url=<target>, also /redir).
export const unwrapYelp: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, redirectPaths)) {
      return
    }

    return extractTarget(url)
  },
})
