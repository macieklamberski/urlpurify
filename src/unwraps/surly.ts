import { decodePercent } from 'trousse'
import { createUnwrapper } from '../utils.js'

// The partner's toolbar id, `AA` and six digits, may follow the target.
const pathRegex = /^\/o\/(?<target>[^/].*?)(?:\/AA\d{6})?$/i
const schemeRegex = /^https?:\/\//i

// Sur.ly link toolbar (sur.ly/o/<target>/<partner id>, also on www.sur.ly), with the target's
// scheme usually dropped and the rest of it percent-encoded once.
// Opt-in: unwrapping drops the publisher's commission. Unwrapping removes the partner's toolbar
// earnings.
export const unwrapSurly = createUnwrapper({
  hosts: ['sur.ly', 'www.sur.ly'],
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    const path = decodePercent(match.groups.target)

    // Sur.ly forwards every target over https, an http-only site too, as of 2026-10-06.
    return `https://${path.replace(schemeRegex, '')}`
  },
})
