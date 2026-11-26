import { isHostOrSubdomainOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const gluedHostRegex = /^\/(?=\/(?:[a-z0-9-]+\.)+[a-z]{2,}\/)/i

// Wikidot wiki with a protocol-relative src glued onto its own host as text
// (<wiki>.wikidot.com//<host>/<path>), which Wikidot redirects to a wiki page named after the host.
export const unwrapWikidot: UrlUnwrapper = createUnwrapper(
  'wikidot.com',
  isHostOrSubdomainOf,
  (url) => {
    return getPathTarget(url, gluedHostRegex)
  },
)
