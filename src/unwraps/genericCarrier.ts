import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeEncodedScheme, decodeParamValue } from '../utils.js'

const httpTargetRegex = /^https?:\/\//i

const carriers = [
  'url',
  'feedurl',
  'moduleurl',
  'feed.url',
  '.url',
  'link',
  'redirect',
  'to',
  'go',
  'goto',
  'out',
]

// A url in a carrier param, such as `url`, `feedurl` or `goto`, on any host and any path
// (<host>/<path>?url=<target>), the only unwrapper that names no path. The first http url wins.
// Opt-in: on an unknown host the param may be an argument to the page, not where it leads.
export const unwrapGenericCarrier: UrlUnwrapper = (url) => {
  const params = url.search.slice(1).split('&')

  for (const [index, param] of params.entries()) {
    const separator = param.indexOf('=')

    if (separator === -1 || !isAnyOf(param.slice(0, separator), carriers)) {
      continue
    }

    const raw = param.slice(separator + 1)
    let target = decodeEncodedScheme(decodeParamValue(raw))

    if (!httpTargetRegex.test(target)) {
      continue
    }

    // A raw target with a query of its own is not escaped, so every `&` after it is its own.
    if (httpTargetRegex.test(raw) && raw.includes('?')) {
      target = decodeParamValue([raw, ...params.slice(index + 1)].join('&'))
    }

    // An escaped target can hold its own `%23` fragment, which wins over the link's.
    if (target.includes('#')) {
      return target
    }

    return `${target}${url.hash}`
  }
}
