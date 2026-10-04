import { createParamExtractor } from '../utils.js'

// Juejin external link redirect (link.juejin.cn/?target=<target>), on juejin.cn and its subdomains.
export const unwrapJuejin = createParamExtractor({
  domains: 'juejin.cn',
  path: '/',
  params: ['target'],
})
