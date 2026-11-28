import { isAnyOf } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// The first segment is the language pair plus an optional session token. A target with no
// scheme segment is http.
const proxyPathRegex = /^\/proxy_u\/[^/]+\/(?:(?<scheme>https?)\/)?(?<target>.+)$/i

// Yandex Translate page proxy (translated.turbopages.org/proxy_u/<langs>/[<scheme>/]<host>/<path>).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapYandexTranslate = createUnwrapper({
  hosts: 'translated.turbopages.org',
  unwrap: (url) => {
    const match = proxyPathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    const scheme = isAnyOf(match.groups.scheme, 'https') ? 'https' : 'http'

    return resolvePathTarget(url, match.groups.target, scheme)
  },
})
