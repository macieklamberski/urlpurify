import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const paths = ['/v1/url', '/url']

// FireEye email link protection (protect2.fireeye.com/v1/url?u=<target> or /url?u=<target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapFireeye: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'protect2.fireeye.com') || !paths.includes(url.pathname)) {
    return
  }

  const target = url.searchParams.get('u')

  if (target && isHttpUrl(target)) {
    return target
  }
}
