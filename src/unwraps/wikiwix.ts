import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractCacheTarget = createParamExtractor({
  hosts: ['archive.wikiwix.com', 'wikiwix.com'],
  path: '/cache/',
  params: ['url'],
})

// wikiwix.com answers /cache/index2.php with a 404.
const extractIndexTarget = createParamExtractor({
  hosts: 'archive.wikiwix.com',
  path: '/cache/index2.php',
  params: ['url'],
})

// Wikiwix archive snapshot (archive.wikiwix.com/cache/?url=<target> or /cache/index2.php?url=
// <target>, and wikiwix.com/cache/?url=<target>). Opt-in: unwrapping returns the live page,
// which may have changed or be gone.
export const unwrapWikiwix: UrlUnwrapper = (url) => {
  return extractCacheTarget(url) ?? extractIndexTarget(url)
}
