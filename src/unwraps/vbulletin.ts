import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A forum root prefix, such as /forum/ or /boards/.
const pathRegex = /^(?:\/[^/]+)?\/redirect-to\/$/

// vBulletin SEO add-on external link redirect, vBSEO and DragonByte SEO
// (<forum host>/redirect-to/?redirect=<target>). Each forum runs on its own host, so the exact
// path and an http `redirect` are the guard, not the host.
export const unwrapVbulletin: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('redirect')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
