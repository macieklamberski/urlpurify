import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the web prefix.
const pathRegex = /^\/web\/\d{14}\/(.+)$/

// Library and Archives Canada web archive snapshot
// (webarchiveweb.wayback.bac-lac.canada.ca/web/<timestamp>/<target>). Opt-in: unwrapping returns
// the live page, which may have changed or be gone.
export const unwrapBacLacWebArchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'webarchiveweb.wayback.bac-lac.canada.ca')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
