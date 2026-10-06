import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The main host and its numbered snapshot hosts, such as `s01.megalodon.jp`.
const hostRegex = /^(?:s\d{2}\.)?megalodon\.jp$/
// The snapshot is its capture time, `YYYY-MMDD-HHMM-SS`.
const pathRegex = /^\/\d{4}-\d{4}-\d{4}-\d{2}\/(.+)$/
const schemeRegex = /^[a-z][a-z\d+.-]*:/i

// Megalodon archive snapshot (megalodon.jp/<YYYY-MMDD-HHMM-SS>/<target>, also on the numbered
// hosts s01 to s04.megalodon.jp). Not included in defaultUnwrappers: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapMegalodon: UrlUnwrapper = (url) => {
  if (!hostRegex.test(url.hostname)) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An http target is stored with no scheme, an https one with its scheme and `:443`.
  const target = schemeRegex.test(match[1]) ? match[1] : `http://${match[1]}`

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const unwrapped = `${target}${url.search}${url.hash}`

  if (isHttpUrl(unwrapped)) {
    return unwrapped
  }
}
