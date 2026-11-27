import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractCacheTarget = createQueryUnwrapper({
  hosts: ['archive.wikiwix.com', 'wikiwix.com'],
  path: '/cache/',
  params: ['url'],
  ignoreLinkFragment: true,
})

// wikiwix.com answers /cache/index2.php with a 404.
const extractIndexTarget = createQueryUnwrapper({
  hosts: 'archive.wikiwix.com',
  path: '/cache/index2.php',
  params: ['url'],
  ignoreLinkFragment: true,
})

// Wikiwix archive snapshot (archive.wikiwix.com/cache/?url=<target> or /cache/index2.php?url=
// <target>, and wikiwix.com/cache/?url=<target>). Opt-in: unwrapping returns the live page,
// which may have changed or be gone.
export const unwrapWikiwix = createUnwrapper({
  hosts: ['archive.wikiwix.com', 'wikiwix.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return extractCacheTarget(url) ?? extractIndexTarget(url)
  },
})
