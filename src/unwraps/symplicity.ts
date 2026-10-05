import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = ['ct.symplicity.com', 'law-pacific-csm.symplicity.com', 'umd-csm.symplicity.com']

// The target follows `realurl=` in the path unencoded, often with a single slash after the scheme.
const clickPathRegex = /^\/(?:t\/[a-z]+|track)\/[0-9a-f]{32}\/\d+\/realurl=(https?:.*)$/

// Symplicity email click tracker (ct.symplicity.com/t/<office>/<32 hex>/<n>/realurl=<target>, also
// <school>-csm.symplicity.com/track/<32 hex>/<n>/realurl=<target>). Opt-in: unwrapping removes the
// sender's click count.
export const unwrapSymplicity: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const match = clickPathRegex.exec(url.pathname)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
