import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const legacyTargetRegex = /^\/l\/[\w-]+[/;]\/*(?<target>[^/].*)$/i

const hosts = [
  'l.facebook.com',
  'lm.facebook.com',
  'facebook.com',
  'www.facebook.com',
  'upload.facebook.com',
  'm.facebook.com',
  'web.facebook.com',
  'pt-br.facebook.com',
  'free.facebook.com',
  'business.facebook.com',
  '0.facebook.com',
  'l.messenger.com',
  'l.workplace.com',
]

const extractLinkPhp = createQueryUnwrapper({
  hosts,
  path: '/l.php',
  params: ['u'],
})

const extractShim = createQueryUnwrapper({
  hosts: 'l.facebook.com',
  path: ['/', '/lsr.php'],
  params: ['u'],
})

const extractLegacy = createUnwrapper({
  hosts: ['facebook.com', 'www.facebook.com', 'l.facebook.com'],
  unwrap: (url) => {
    const match = legacyTargetRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    // A target with its scheme kept is percent-encoded once, twice or half-encoded as `https%3A//`.
    // Facebook's leaving page and its 302 into l.php both gave a target without a scheme `http://`.
    return resolvePathTarget(url, match.groups.target, 'http')
  },
})

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload., m., web., pt-br.,
// free., business., 0. and bare facebook.com, l.messenger.com and l.workplace.com), on / and
// /lsr.php on l.facebook.com, and the legacy /l/<token>/<target> or /l/<token>;<target> on www.,
// bare and l.facebook.com, where a target without a scheme gets `http://`.
export const unwrapFacebook = createUnwrapper({
  hosts,
  unwrap: (url) => {
    return extractLinkPhp(url) ?? extractShim(url) ?? extractLegacy(url)
  },
})
