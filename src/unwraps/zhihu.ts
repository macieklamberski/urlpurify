import { createParamExtractor } from '../utils.js'

// Zhihu external redirect (link.zhihu.com/?target=<target>), on every subdomain.
export const unwrapZhihu = createParamExtractor({
  domains: 'zhihu.com',
  path: '/',
  params: ['target'],
})
