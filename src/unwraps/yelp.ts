import { createQueryUnwrapper } from '../utils.js'

// Yelp outbound link redirect (www.yelp.com/biz_redir?url=<target>, also /redir).
export const unwrapYelp = createQueryUnwrapper({
  hosts: ['www.yelp.com'],
  path: ['/biz_redir', '/redir'],
  params: ['url'],
})
