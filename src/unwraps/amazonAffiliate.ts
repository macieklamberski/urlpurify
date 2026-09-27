import type { UrlUnwrapper } from '../types.js'

const amazonHostRegex = /\.amazon-adsystem\.com$/
const amazonPathRegex = /^\/x\/c\/[^/]+\/(https?:\/\/.+)$/

// Amazon affiliate click tracker (<region>.amazon-adsystem.com/x/c/<id>/<URL>).
// The target URL is appended verbatim to the path after the click identifier.
export const unwrapAmazonAffiliate: UrlUnwrapper = (url) => {
  if (!amazonHostRegex.test(url.hostname)) {
    return
  }

  const match = url.pathname.match(amazonPathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
