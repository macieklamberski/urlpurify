import { getQueryParam, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^(?:\/[^/]+)*\/media\/oembed$/i

// Drupal media oEmbed frame on the site's own domain, below a language or subsite prefix too
// (<host>/media/oembed?url=<page>&max_width=<n>&max_height=<n>&hash=<hmac>).
// On any host, a `hash` param and an http `url` tell Drupal's frame from another site's
// /media/oembed path. Drupal reads the last `url`.
// Not included in defaultUnwrappers: unwrapping swaps the site's frame for the provider's page.
export const unwrapDrupalOembed: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const hash = getQueryParam(url, 'hash')

    if (!hash) {
      return
    }

    const target = readParamTarget(url, 'url', -1)

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
