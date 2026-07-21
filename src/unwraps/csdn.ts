import { createParamExtractor } from '../utils.js'

// CSDN external link redirect (link.csdn.net/?target=<target>). Same shape as the other
// Chinese dev-platform shims (Juejin, Sspai, Gitee).
export const unwrapCsdn = createParamExtractor({
  hosts: 'link.csdn.net',
  params: ['target'],
})
