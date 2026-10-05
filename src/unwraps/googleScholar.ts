import { createParamExtractor } from '../utils.js'

const scholarHostRegex = /^scholar\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

// Google Scholar search-result redirect (scholar.google.<TLD>/scholar_url?url=<target>), also
// Scholar Alert links that carry the target in q (/scholar_url?hl=<lang>&q=<target>&scisig=<sig>).
export const unwrapGoogleScholar = createParamExtractor({
  hosts: scholarHostRegex,
  path: '/scholar_url',
  params: ['url', 'q'],
})
