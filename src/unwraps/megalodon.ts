import { isHttpUrl } from 'trousse'
import { createUnwrapper } from '../utils.js'

// The snapshot is its capture time, `YYYY-MMDD-HHMM-SS`.
const pathRegex = /^\/\d{4}-\d{4}-\d{4}-\d{2}\/(.+)$/
const schemeRegex = /^[a-z][a-z\d+.-]*:/i

// Megalodon archive snapshot (megalodon.jp/<YYYY-MMDD-HHMM-SS>/<target>, also on the numbered
// hosts s01 to s04.megalodon.jp). Not included in defaultUnwrappers: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapMegalodon = createUnwrapper({
  domains: 'megalodon.jp',
  // The main host and its numbered snapshot hosts, such as `s01.megalodon.jp`.
  match: /^(?:s\d{2}\.)?megalodon\.jp$/,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // An http target is stored with no scheme, an https one with its scheme and `:443`.
    const target = schemeRegex.test(match[1]) ? match[1] : `http://${match[1]}`

    // An unencoded target's query lands in the snapshot URL's own `search`.
    const unwrapped = `${target}${url.search}`

    if (isHttpUrl(unwrapped)) {
      return unwrapped
    }
  },
})
