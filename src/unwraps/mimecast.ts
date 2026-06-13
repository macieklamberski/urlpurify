import type { UrlUnwrapper } from '../types.js'

const mimecastHostRegex = /\.mimecast\.com$/

// Mimecast email link protection (<region>.mimecast.com/...?url=<target> or
// ?domain=<host>). The `domain` form lacks a scheme, so we synthesise https.
export const unwrapMimecast: UrlUnwrapper = (url) => {
  if (!mimecastHostRegex.test(url.hostname)) {
    return
  }

  const targetUrl = url.searchParams.get('url')
  if (targetUrl) {
    return targetUrl
  }

  const targetDomain = url.searchParams.get('domain')
  if (targetDomain) {
    return `https://${targetDomain}`
  }
}
