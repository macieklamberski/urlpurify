import { decodePercent } from 'trousse'
import { isEncodedPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme, matchPathSource } from '../utils.js'

// Cloudinary prefixes the path with the cloud name, Substack serves it from the root.
const fetchPathRegex = /^(?:\/[^/]+)*\/image\/fetch\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i
const lastSchemeRegex = /^.*https?(?::|%(?:25)?3a)./i

// Cloudinary fetch on any delivery host, as Substack's substackcdn.com serves it
// (res.cloudinary.com/<cloud>/image/fetch/<options>/<source>). Not included in defaultUnwrappers:
// unwrapping swaps the resized copy for the original image.
export const unwrapCloudinaryFetch: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const source = matchPathSource(url.pathname, fetchPathRegex, lastSchemeRegex)

    if (!source) {
      return
    }

    // An encoded source holds its own query, so the link's is the proxy's, such as Jetpack's
    // `?resize=`.
    const query = isEncodedPathTarget(source) ? '' : url.search

    // Cloudinary decodes a fetch source once, so its `%3F` is the source's own query. A source
    // encoded twice, as Jetpack spells substackcdn.com's, is decoded once more.
    return decodeEncodedScheme(decodePercent(`${source}${query}`))
  },
})
