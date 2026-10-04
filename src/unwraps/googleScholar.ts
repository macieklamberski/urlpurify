import { createParamExtractor } from '../utils.js'

const scholarHostRegex = /^scholar\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

// Google Scholar search-result redirect (scholar.google.<TLD>/scholar_url?url=<target>).
export const unwrapGoogleScholar = createParamExtractor({
  hosts: scholarHostRegex,
  path: '/scholar_url',
  params: ['url'],
})
