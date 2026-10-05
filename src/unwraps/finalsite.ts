import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const paths = ['/forward.cfm', '/cf_news/forward.cfm']

// Finalsite school website link counter on any host
// (<school host>/cf_news/forward.cfm?dest=<target>&destkey=<signature>). `destkey` signs the
// redirect and is not needed to reach the target. Each school runs the platform on its own host.
export const unwrapFinalsite: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname) || !url.searchParams.has('destkey')) {
    return
  }

  const target = url.searchParams.get('dest')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
