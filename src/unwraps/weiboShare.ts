import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Weibo share (service.weibo.com/share/share.php?url=<target>, on service.weibo.com and
// v.t.sina.com.cn). title= is the message text and pic= an image, so neither is read. Opt-in:
// unwrapping returns the shared page, not the form that shares it.
export const unwrapWeiboShare: UrlUnwrapper = createParamExtractor({
  hosts: ['service.weibo.com', 'v.t.sina.com.cn'],
  path: '/share/share.php',
  params: ['url'],
})
