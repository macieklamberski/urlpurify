import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:[a-z0-9]{6})?$/

// TargetCircle affiliate click (c.trackmytarget.com/?a=<id>&i=<id>&r=<target>, also /<link
// id>?r=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapTargetCircle = createQueryUnwrapper({
  hosts: ['c.trackmytarget.com'],
  path: pathRegex,
  params: ['r'],
})
