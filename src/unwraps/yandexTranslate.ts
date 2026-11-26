import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The first segment is the language pair plus an optional session token. A target with no
// scheme segment is http.
const proxyPathRegex = /^\/proxy_u\/[^/]+\/(?:(?<scheme>https?)\/)?(?<target>.+)$/i

// Yandex Translate page proxy (translated.turbopages.org/proxy_u/<langs>/[<scheme>/]<host>/<path>).
// Not included in defaultUnwrappers: the proxy renders the target translated, so unwrapping
// discards the translation the user wanted.
export const unwrapYandexTranslate: UrlUnwrapper = createUnwrapper({
  hosts: 'translated.turbopages.org',
  unwrap: (url) => {
    const match = url.pathname.match(proxyPathRegex)

    if (!match?.groups) {
      return
    }

    return `${match.groups.scheme ?? 'http'}://${match.groups.target}${url.search}${url.hash}`
  },
})
