import { createParamExtractor } from '../utils.js'

// Juejin external link redirect (link.juejin.cn/?target=<target>).
export const unwrapJuejin = createParamExtractor({
  hosts: 'link.juejin.cn',
  path: '/',
  params: ['target'],
})
