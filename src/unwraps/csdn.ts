import { createQueryUnwrapper } from '../utils.js'

// CSDN external link redirect (link.csdn.net/?target=<target>). Same shape as the other
// Chinese dev-platform shims (Juejin, Sspai, Gitee).
export const unwrapCsdn = createQueryUnwrapper({
  hosts: 'link.csdn.net',
  path: '/',
  params: ['target'],
})
