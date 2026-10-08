import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const paths = ['/forward.cfm', '/cf_news/forward.cfm']

// Finalsite school website link counter on any host
// (<school host>/cf_news/forward.cfm?dest=<target>&destkey=<signature>). `destkey` signs the
// redirect and is not needed to reach the target. Each school runs the platform on its own host.
export const unwrapFinalsite: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname) || !url.searchParams.has('destkey')) {
    return
  }

  // A Finalsite email link nested unencoded in `dest` spills its own `dest` into this query, so
  // the last one holds the target.
  const target = getParamTarget(url, 'dest', -1)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
