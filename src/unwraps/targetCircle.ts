import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/(?:[a-z0-9]{6})?$/

const extractTarget = createParamExtractor({
  hosts: 'c.trackmytarget.com',
  params: ['r'],
})

// TargetCircle affiliate click (c.trackmytarget.com/?a=<id>&i=<id>&r=<target>, also /<link
// id>?r=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapTargetCircle: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
