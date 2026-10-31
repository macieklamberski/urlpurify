import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Cloudinary prefixes the path with the cloud name, Substack serves it from the root.
const fetchPathRegex = /^(?:\/[^/]+)*\/image\/fetch\/.*?(?<source>https?(?::|%3a).+)$/i

// Cloudinary fetch on any delivery host, as Substack's substackcdn.com serves it
// (res.cloudinary.com/<cloud>/image/fetch/<options>/<source>). Not included in defaultUnwrappers:
// unwrapping swaps the resized copy for the original image.
export const unwrapCloudinaryFetch: UrlUnwrapper = (url) => {
  const source = url.pathname.match(fetchPathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(`${source}${url.search}${url.hash}`)
}
