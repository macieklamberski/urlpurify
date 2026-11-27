import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:[a-z0-9]{6})?$/

const hosts = ['c.trackmytarget.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['r'],
})

// TargetCircle affiliate click (c.trackmytarget.com/?a=<id>&i=<id>&r=<target>, also /<link
// id>?r=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapTargetCircle = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
