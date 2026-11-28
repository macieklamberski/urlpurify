import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper, httpSchemeRegex } from '../utils.js'

const legacyTargetRegex = /^\/l\/[\w-]+[/;]\/*([^/].*)$/i

const unwrapLinkPhp = createQueryUnwrapper({
  hosts: [
    'l.facebook.com',
    'lm.facebook.com',
    'www.facebook.com',
    'upload.facebook.com',
    'm.facebook.com',
    'web.facebook.com',
    'pt-br.facebook.com',
    'free.facebook.com',
    'business.facebook.com',
    '0.facebook.com',
    'facebook.com',
    'l.messenger.com',
    'l.workplace.com',
  ],
  path: '/l.php',
  params: ['u'],
})

const unwrapRoot = createQueryUnwrapper({
  hosts: 'l.facebook.com',
  path: '/',
  params: ['u'],
})

const unwrapLsr = createQueryUnwrapper({
  hosts: 'l.facebook.com',
  path: '/lsr.php',
  params: ['u'],
})

const unwrapLegacy = createUnwrapper({
  hosts: ['www.facebook.com', 'l.facebook.com'],
  unwrap: (url) => {
    const match = url.pathname.match(legacyTargetRegex)

    if (!match) {
      return
    }

    // A target with its scheme kept is percent-encoded once, twice or half-encoded as `https%3A//`.
    const path = decodePathTarget(match[1])

    const target = `${path}${url.search}`

    if (httpSchemeRegex.test(target)) {
      return target
    }

    // Facebook's leaving page and its 302 into l.php both gave a target without a scheme `http://`.
    return `http://${target}`
  },
})

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload., m., web., pt-br.,
// free., business., 0. and bare facebook.com, l.messenger.com and l.workplace.com), on / and
// /lsr.php on l.facebook.com, and the legacy /l/<token>/<target> or /l/<token>;<target> on www.
// and l.facebook.com, where a target without a scheme gets `http://`.
export const unwrapFacebookShim: UrlUnwrapper = (url) => {
  return unwrapLinkPhp(url) ?? unwrapRoot(url) ?? unwrapLsr(url) ?? unwrapLegacy(url)
}
