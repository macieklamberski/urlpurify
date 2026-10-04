import { createParamExtractor } from '../utils.js'

// Zhihu external redirect (link.zhihu.com/?target=<target>).
export const unwrapZhihu = createParamExtractor({
  hosts: 'link.zhihu.com',
  path: '/',
  params: ['target'],
})
