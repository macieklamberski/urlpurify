import { createParamExtractor } from '../utils.js'

// Jianshu external link redirect (links.jianshu.com/go?to=<target>), on jianshu.com and every
// subdomain.
export const unwrapJianshuGo = createParamExtractor({
  domains: 'jianshu.com',
  path: '/go',
  params: ['to'],
})
