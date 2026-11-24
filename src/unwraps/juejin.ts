import { createQueryUnwrapper } from '../utils.js'

// Juejin external link redirect (link.juejin.cn/?target=<target>), also on the old link.juejin.im.
export const unwrapJuejin = createQueryUnwrapper({
  hosts: ['link.juejin.cn', 'link.juejin.im'],
  path: '/',
  params: ['target'],
})
