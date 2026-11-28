import { createQueryUnwrapper } from '../utils.js'

// Sspai external link redirect (sspai.com/link?target=<target>).
export const unwrapSspai = createQueryUnwrapper({
  hosts: ['sspai.com', 'www.sspai.com', 'client.sspai.com'],
  path: '/link',
  params: ['target'],
})
