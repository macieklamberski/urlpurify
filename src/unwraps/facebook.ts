import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const legacyPrefixRegex = /^\/l\/[\w-]+[/;]/
const legacyEncodedTargetRegex = /^\/l\/[\w-]+[/;](https?%(?:25)?3A.*)$/i
const encodedSchemeRegex = /^https?%3A/i

const unwrapLinkPhp = createParamExtractor({
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

const unwrapRoot = createParamExtractor({
  hosts: 'l.facebook.com',
  path: '/',
  params: ['u'],
})

const unwrapLsr = createParamExtractor({
  hosts: 'l.facebook.com',
  path: '/lsr.php',
  params: ['u'],
})

// A target with its scheme kept is percent-encoded once or twice, or half-encoded as `https%3A//`.
const decodeLegacyTarget = (value: string): string | undefined => {
  try {
    const decoded = decodeURIComponent(value)

    if (!encodedSchemeRegex.test(decoded)) {
      return decoded
    }

    return decodeURIComponent(decoded)
  } catch {}
}

const unwrapLegacy: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['www.facebook.com', 'l.facebook.com'])) {
    return
  }

  const encodedMatch = url.pathname.match(legacyEncodedTargetRegex)

  if (!encodedMatch) {
    return getPathTarget(url, legacyPrefixRegex)
  }

  const target = decodeLegacyTarget(encodedMatch[1])

  if (!target) {
    return
  }

  return `${target}${url.search}${url.hash}`
}

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload., m., web., pt-br.,
// free., business., 0. and bare facebook.com, l.messenger.com and l.workplace.com), on / and
// /lsr.php on l.facebook.com, and the legacy /l/<token>/<target> or /l/<token>;<target> on www.
// and l.facebook.com, where a target without a scheme gets `https://`.
export const unwrapFacebookShim: UrlUnwrapper = (url) => {
  return unwrapLinkPhp(url) ?? unwrapRoot(url) ?? unwrapLsr(url) ?? unwrapLegacy(url)
}
