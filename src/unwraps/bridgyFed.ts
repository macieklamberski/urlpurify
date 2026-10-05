import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = ['fed.brid.gy', 'bsky.brid.gy', 'web.brid.gy']
const pathRegex = /^\/r\/(https?:\/\/.+)$/

// Bridgy Fed redirect for a bridged post or profile (fed.brid.gy/r/<target>, also bsky.brid.gy
// and web.brid.gy). A browser gets a 301 to the target.
export const unwrapBridgyFed: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the redirect URL's own `search` and `hash`.
  return `${match[1]}${url.search}${url.hash}`
}
