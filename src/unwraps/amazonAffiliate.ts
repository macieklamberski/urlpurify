import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const amazonPathRegex = /^\/x\/c\/[^/]+\/(https?:\/\/.+)$/
const amazonHostRegex = /^aax(?:-[a-z]+)*\.amazon-adsystem\.com$|^aax-us-iad\.amazon\.com$/
const storeHostRegex =
  /^(?:www|smile|affiliate-program)\.amazon\.(?:ca|co\.jp|co\.uk|com|com\.au|com\.br|de|es|fr|it)$/
const storeRedirectPathRegex = /^\/gp\/redirect\.html(?:\/ref=.+)?$/
const sponsoredRedirectPathRegex = /^\/gp\/slredirect\/picassoRedirect\.html\/ref=.+$/
const emailRedirectPaths = ['/gp/r.html', '/gp/f.html']

// Amazon affiliate click tracker (aax-<region>.amazon-adsystem.com and aax-us-iad.amazon.com,
// /x/c/<id>/<URL>) and store redirects on amazon.<tld>: /gp/redirect.html[/ref=<ref>]?location=<URL>,
// /exec/obidos/redirect?path=<URL>, /gp/r.html and /gp/f.html?U=<URL>,
// /gp/slredirect/picassoRedirect.html/ref=<ref>?url=<URL>.
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

  if (!amazonHostRegex.test(url.hostname)) {
    return
  }

  const match = url.pathname.match(amazonPathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
