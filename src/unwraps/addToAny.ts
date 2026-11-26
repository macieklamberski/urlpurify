import { isAnyOf, isHostOf, isHttpUrl, parseUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['www.addtoany.com', 'addtoany.com']
const servicePathRegex = /^\/add_to\/[^/]+$/i
const menuPaths = ['/share', '/share_save']

// The target of a share menu page, read from `?linkurl=` or, as the share button writes it, from
// `#url=`, which the page's script reads and the server never sees.
const getMenuTarget = (url: URL): string | undefined => {
  const target = readParamTarget(url, 'linkurl')

  if (target) {
    return target
  }

  const fragment = parseUrl(`?${url.hash.slice(1)}`, url)

  return fragment && readParamTarget(fragment, 'url')
}

// AddToAny share links (addtoany.com/add_to/<service>?linkurl=<page>, /email?linkurl=, which
// redirects to /add_to/email, and the menu at /share or /share_save with ?linkurl= or #url=).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapAddToAny: UrlUnwrapper = createUnwrapper(hosts, isHostOf, (url) => {
  let target: string | undefined

  if (servicePathRegex.test(url.pathname) || isAnyOf(url.pathname, '/email')) {
    target = readParamTarget(url, 'linkurl')
  } else if (isAnyOf(url.pathname, menuPaths)) {
    target = getMenuTarget(url)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
})
