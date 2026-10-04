import { createParamExtractor } from '../utils.js'

// Sspai external link redirect (sspai.com/link?target=<target>).
export const unwrapSspai = createParamExtractor({
  hosts: ['sspai.com', 'client.sspai.com'],
  path: '/link',
  params: ['target'],
})
