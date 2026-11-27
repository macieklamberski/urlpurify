import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const redirectPaths = ['/biz_redir', '/redir']

const extractTarget = createQueryUnwrapper({
  hosts: 'www.yelp.com',
  params: ['url'],
})

// Yelp outbound link redirect (www.yelp.com/biz_redir?url=<target>, also /redir).
export const unwrapYelp: UrlUnwrapper = (url) => {
  if (!redirectPaths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
