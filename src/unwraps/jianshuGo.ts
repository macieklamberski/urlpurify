import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapGo = createParamExtractor({
  hosts: 'links.jianshu.com',
  path: '/go',
  params: ['to'],
})

const unwrapLink = createParamExtractor({
  hosts: 'link.jianshu.com',
  path: '/',
  params: ['t'],
})

// Jianshu external link redirect (links.jianshu.com/go?to=<target>), and the older one on the root
// path (link.jianshu.com/?t=<target>).
export const unwrapJianshuGo: UrlUnwrapper = (url) => {
  return unwrapGo(url) ?? unwrapLink(url)
}
