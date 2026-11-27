import { createQueryUnwrapper } from '../utils.js'

// Zhihu external redirect (link.zhihu.com/?target=<target>).
export const unwrapZhihu = createQueryUnwrapper({
  hosts: 'link.zhihu.com',
  path: '/',
  params: ['target'],
})
