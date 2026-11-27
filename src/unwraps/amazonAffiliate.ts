import { isAnyOf, isBrandDomainOf, isHostOf, isHttpUrl, startsWithAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const amazonPathRegex = /^\/x\/c\/[^/]+\/(https?:\/\/.+)$/i
const amazonHostRegex = /^aax(?:-[a-z]+)*\.amazon-adsystem\.com$|^aax-us-iad\.amazon\.com$/
const storeRedirectPathRegex = /^\/gp\/redirect\.html(?:\/ref=.+)?$/i
const sponsoredRedirectPathRegex = /^\/gp\/slredirect\/picassoRedirect\.html\/ref=.+$/i

const storeSubdomains = ['www.', 'smile.', 'affiliate-program.']
const emailRedirectPaths = ['/gp/r.html', '/gp/f.html']

// Amazon affiliate click tracker (aax-<region>.amazon-adsystem.com and aax-us-iad.amazon.com,
// /x/c/<id>/<URL>) and store redirects on amazon.<tld>: /gp/redirect.html[/ref=<ref>]?location=<URL>,
// /exec/obidos/redirect?path=<URL>, /gp/r.html and /gp/f.html?U=<URL>,
// /gp/slredirect/picassoRedirect.html/ref=<ref>?url=<URL>.
export const unwrapAmazonAffiliate: UrlUnwrapper = (url) => {
  if (isBrandDomainOf(url, 'amazon') && startsWithAnyOf(url.hostname, storeSubdomains)) {
    let target: string | undefined

    if (storeRedirectPathRegex.test(url.pathname)) {
      target = getParamTarget(url, 'location')
    }

    if (isAnyOf(url.pathname, '/exec/obidos/redirect')) {
      target = getParamTarget(url, 'path')
    }

    if (emailRedirectPaths.includes(url.pathname)) {
      target = getParamTarget(url, 'U')
    }

    if (sponsoredRedirectPathRegex.test(url.pathname)) {
      target = getParamTarget(url, 'url')
    }

    if (target && isHttpUrl(target)) {
      return target
    }

    return
  }

  if (!isHostOf(url, amazonHostRegex)) {
    return
  }

  const match = url.pathname.match(amazonPathRegex)

  if (!match) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
