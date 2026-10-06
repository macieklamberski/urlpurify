import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The counter forwards only to The Register's own sites, so the target must start with one of
// them, with or without its scheme. Any other host lands on a missing page on theregister.com.
const feedPrefixRegex =
  /^\/feed\/(?=(?:https?:\/\/)?www\.(?:theregister\.com|theregister\.co\.uk|reghardware\.co\.uk|channelregister\.co\.uk)\/)/i

// The Register feed click counter (go.theregister.com/feed/<target>), where the target is an
// article on The Register or its former sister sites, with or without its scheme. It answers 302 to
// the https article.
export const unwrapTheRegister: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'go.theregister.com')) {
    return
  }

  return getPathTarget(url, feedPrefixRegex)
}
