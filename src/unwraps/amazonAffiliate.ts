import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const amazonPathRegex = /^\/x\/c\/[^/]+\/(https?:\/\/.+)$/
const storeHostRegex = /(?:^|\.)amazon\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const storeRedirectPathRegex = /^\/gp\/redirect\.html(?:\/ref=.+)?$/
const sponsoredRedirectPathRegex = /^\/gp\/slredirect\/picassoRedirect\.html\/ref=.+$/
const emailRedirectPaths = ['/gp/r.html', '/gp/f.html']

// Amazon affiliate click tracker (<region>.amazon-adsystem.com/x/c/<id>/<URL>) and store redirects
// on any amazon.<tld> and its subdomains: /gp/redirect.html[/ref=<ref>]?location=, /gp/r.html and
// /gp/f.html?U=, /exec/obidos/redirect?path=, /gp/slredirect/picassoRedirect.html/ref=<ref>?url=.
export const unwrapAmazonAffiliate: UrlUnwrapper = (url) => {
  if (storeHostRegex.test(url.hostname)) {
    let target: string | null = null

    if (storeRedirectPathRegex.test(url.pathname)) {
      target = url.searchParams.get('location')
    }

    if (url.pathname === '/exec/obidos/redirect') {
      target = url.searchParams.get('path')
    }

    if (emailRedirectPaths.includes(url.pathname)) {
      target = url.searchParams.get('U')
    }

    if (sponsoredRedirectPathRegex.test(url.pathname)) {
      target = url.searchParams.get('url')
    }

    if (target && isHttpUrl(target)) {
      return target
    }

    return
  }

  if (!isHostOrSubdomainOf(url, 'amazon-adsystem.com')) {
    return
  }

  const match = url.pathname.match(amazonPathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
