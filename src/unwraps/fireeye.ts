import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

const paths = ['/v1/url', '/url']

// FireEye email link protection (protect2.fireeye.com/v1/url?u=<target> or /url?u=<target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapFireeye: UrlUnwrapper = createUnwrapper({
  hosts: 'protect2.fireeye.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    const target = getParamTarget(url, 'u')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
