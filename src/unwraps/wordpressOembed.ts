import { getQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const prettyPathRegex = /^(?:\/[^/]+)*\/wp-json\/oembed\/1\.0\/embed$/i
const restRoutePathRegex = /^(?:\/[^/]+)*\/(?:index\.php)?$/i

// WordPress oEmbed API on any host, below a subfolder install too, reading the last `url`
// (<host>/wp-json/oembed/1.0/embed?url=<page>, <host>/?rest_route=/oembed/1.0/embed&url=<page>).
// Not included in defaultUnwrappers: unwrapping swaps the data about a page for the page.
export const unwrapWordpressOembed: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const isPrettyRoute = prettyPathRegex.test(url.pathname)
    const isRestRoute =
      restRoutePathRegex.test(url.pathname) &&
      isAnyOf(getQueryParam(url, 'rest_route'), '/oembed/1.0/embed')

    if (!isPrettyRoute && !isRestRoute) {
      return
    }

    const target = readParamTarget(url, 'url', -1)

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
