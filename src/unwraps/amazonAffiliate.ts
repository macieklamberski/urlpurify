import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const amazonHostRegex = /\.amazon-adsystem\.com$/
const amazonPathRegex = /^\/x\/c\/[^/]+\/(https?:\/\/.+)$/
const storeHostRegex =
  /^(?:www|smile|affiliate-program)\.amazon\.(?:ca|co\.jp|co\.uk|com|com\.br|de|es|fr|it)$/
const storeRedirectPathRegex = /^\/gp\/redirect\.html(?:\/ref=.+)?$/

// Amazon affiliate click tracker (<region>.amazon-adsystem.com/x/c/<id>/<URL>), and the store's
// own redirects: amazon.<tld>/gp/redirect.html[/ref=<ref>]?location=<URL>,
// /exec/obidos/redirect?path=<URL> and /gp/r.html?U=<URL>.
export const unwrapAmazonAffiliate: UrlUnwrapper = (url) => {
  if (storeHostRegex.test(url.hostname)) {
    let target: string | null = null

    if (storeRedirectPathRegex.test(url.pathname)) {
      target = url.searchParams.get('location')
    }

    if (url.pathname === '/exec/obidos/redirect') {
      target = url.searchParams.get('path')
    }

    if (url.pathname === '/gp/r.html') {
      target = url.searchParams.get('U')
    }

    if (target && isHttpUrl(target)) {
      return target
    }

    return
  }

  if (!amazonHostRegex.test(url.hostname)) {
    return
  }

  const match = url.pathname.match(amazonPathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
