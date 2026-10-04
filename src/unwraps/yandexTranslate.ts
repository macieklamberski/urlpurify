import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The first segment is the language pair plus an optional session token. A target with no
// scheme segment is http.
const proxyPathRegex = /^\/proxy_u\/[^/]+\/(?:(https?)\/)?(.+)$/

// Yandex Translate page proxy (translated.turbopages.org/proxy_u/<langs>/[<scheme>/]<host>/<path>).
// Not included in defaultUnwrappers: the proxy renders the target translated, so unwrapping
// discards the translation the user wanted.
export const unwrapYandexTranslate: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'translated.turbopages.org')) {
    return
  }

  const match = url.pathname.match(proxyPathRegex)

  if (!match) {
    return
  }

  return `${match[1] ?? 'http'}://${match[2]}${url.search}${url.hash}`
}
