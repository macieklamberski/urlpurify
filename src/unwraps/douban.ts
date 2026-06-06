import { createParamExtractor } from '../utils.js'

// Douban external link redirect (www.douban.com/link2/?url=<target>).
export const unwrapDouban = createParamExtractor({
  hosts: 'www.douban.com',
  path: '/link2/',
  params: ['url'],
})
