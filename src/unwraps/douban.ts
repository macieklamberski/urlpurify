import { createParamExtractor } from '../utils.js'

// Douban external link redirect (www.douban.com/link2/?url=<target>), on the domain and every
// subdomain.
export const unwrapDouban = createParamExtractor({
  domains: 'douban.com',
  path: '/link2/',
  params: ['url'],
})
