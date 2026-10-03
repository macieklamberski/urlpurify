import { createParamExtractor } from '../utils.js'

// A8.net affiliate redirect (px.a8.net/svt/ejp?a8mat=<id>&a8ejpredirect=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapA8Net = createParamExtractor({
  hosts: ['px.a8.net', 'rpx.a8.net', 'www.a8.net', 'px.moba8.net'],
  path: '/svt/ejp',
  params: ['a8ejpredirect'],
})
