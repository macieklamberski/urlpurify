import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractGo = createQueryUnwrapper({
  hosts: 'links.jianshu.com',
  path: '/go',
  params: ['to'],
})

const extractLink = createQueryUnwrapper({
  hosts: 'link.jianshu.com',
  path: '/',
  params: ['t'],
})

// Jianshu external link redirect (links.jianshu.com/go?to=<target>), and the older one on the root
// path (link.jianshu.com/?t=<target>).
export const unwrapJianshuGo = createUnwrapper({
  hosts: ['links.jianshu.com', 'link.jianshu.com'],
  unwrap: (url) => {
    return extractGo(url) ?? extractLink(url)
  },
})
