import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The counter forwards only to The Register's own sites, so the target must start with one of
// them, with or without its scheme. Any other host lands on a missing page on theregister.com.
const prefixRegex =
  /^\/(?:feed|i\/cfa)\/(?=(?:https?:\/\/)?www\.(?:theregister\.com|theregister\.co\.uk|reghardware\.co\.uk|channelregister\.co\.uk)\/)/

// The Register feed click counter (go.theregister.com/feed/<target>, also
// go.theregister.com/i/cfa/<target>), where the target is an article on The Register or its
// former sister sites, with or without its scheme. It answers 302 to the https article.
export const unwrapTheRegister: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'go.theregister.com')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
