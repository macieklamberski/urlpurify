import { createParamExtractor } from '../utils.js'

export const googleNewsHostRegex = /(?:^|\.)news\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

// Google News legacy redirect (news.google.<TLD>/news/url?url=<target>), on any tld and every
// subdomain.
// Modern news.google.<TLD>/articles/<base64> URLs aren't unwrappable client-side.
export const unwrapGoogleNews = createParamExtractor({
  hosts: googleNewsHostRegex,
  path: '/news/url',
  params: ['url'],
})
