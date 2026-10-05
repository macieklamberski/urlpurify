import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const carrierRegex = /[?&]cm_destination=/

// ContactMonkey internal email click tracker
// (contactmonkey.com/api/v1/tracker?cm_session=<id>&cm_type=link&cm_link=<id>&cm_destination=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapContactMonkey: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'contactmonkey.com') || url.pathname !== '/api/v1/tracker') {
    return
  }

  // The target comes last and unencoded, so its own `&` params belong to it and the whole raw
  // tail is the target.
  const match = carrierRegex.exec(url.search)

  if (!match) {
    return
  }

  return `${url.search.slice(match.index + match[0].length)}${url.hash}`
}
