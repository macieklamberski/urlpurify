import { createQueryUnwrapper } from '../utils.js'

// ByteDance outbound link redirect (link.wtturl.cn/?target=<target>&scene=im&aid=<app id>), also on
// the overseas host sg-link.byteoversea.com.
export const unwrapBytedance = createQueryUnwrapper({
  hosts: ['link.wtturl.cn', 'sg-link.byteoversea.com'],
  path: '/',
  params: ['target'],
})
