import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const unwrapGo = createQueryUnwrapper({
  hosts: 'links.jianshu.com',
  path: '/go',
  params: ['to'],
})

const unwrapLink = createQueryUnwrapper({
  hosts: 'link.jianshu.com',
  path: '/',
  params: ['t'],
})

// Jianshu external link redirect (links.jianshu.com/go?to=<target>), and the older one on the root
// path (link.jianshu.com/?t=<target>).
export const unwrapJianshuGo = createUnwrapper({
  hosts: ['links.jianshu.com', 'link.jianshu.com'],
  unwrap: (url) => {
    return unwrapGo(url) ?? unwrapLink(url)
  },
})
