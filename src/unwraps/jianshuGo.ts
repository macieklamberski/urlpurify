import { createParamExtractor } from '../utils.js'

// Jianshu external link redirect (links.jianshu.com/go?to=<target>).
export const unwrapJianshuGo = createParamExtractor({
  hosts: 'links.jianshu.com',
  path: '/go',
  params: ['to'],
})
