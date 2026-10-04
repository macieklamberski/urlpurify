import { createParamExtractor } from '../utils.js'

// Sspai external link redirect (sspai.com/link?target=<target>), on every subdomain.
export const unwrapSspai = createParamExtractor({
  domains: 'sspai.com',
  path: '/link',
  params: ['target'],
})
