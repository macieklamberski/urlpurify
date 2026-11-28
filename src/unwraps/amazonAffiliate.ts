import { isAnyOf, isBrandDomainOf, isHostOf, startsWithAnyOf } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const amazonPathRegex = /^\/x\/c\/[^/]+\/(?<target>https?:\/\/.+)$/i
const amazonHostRegex = /^aax(?:-[a-z]+)*\.amazon-adsystem\.com$|^aax-us-iad\.amazon\.com$/
const storeRedirectPathRegex = /^\/gp\/redirect\.html(?:\/ref=.+)?$/i
const sponsoredRedirectPathRegex = /^\/gp\/slredirect\/picassoRedirect\.html\/ref=.+$/i

const storeSubdomains = ['www.', 'smile.', 'affiliate-program.']
const emailRedirectPaths = ['/gp/r.html', '/gp/f.html']

// Amazon affiliate click tracker (aax-<region>.amazon-adsystem.com and aax-us-iad.amazon.com,
// /x/c/<id>/<URL>) and store redirects on amazon.<tld>:
// /gp/redirect.html[/ref=<ref>]?location=<URL>, /exec/obidos/redirect?path=<URL>, /gp/r.html and
// /gp/f.html?U=<URL>, /gp/slredirect/picassoRedirect.html/ref=<ref>?url=<URL>.
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapAmazonAffiliate = createUnwrapper({
  brands: 'amazon',
  subdomains: 'amazon-adsystem.com',
  unwrap: (url) => {
    if (isBrandDomainOf(url, 'amazon') && startsWithAnyOf(url.hostname, storeSubdomains)) {
      let target: string | undefined

      if (storeRedirectPathRegex.test(url.pathname)) {
        target = readParamTarget(url, 'location')
      }

      if (isAnyOf(url.pathname, '/exec/obidos/redirect')) {
        target = readParamTarget(url, 'path')
      }

      if (isAnyOf(url.pathname, emailRedirectPaths)) {
        target = readParamTarget(url, 'U')
      }

      if (sponsoredRedirectPathRegex.test(url.pathname)) {
        target = readParamTarget(url, 'url')
      }

      return target
    }

    if (!isHostOf(url, amazonHostRegex)) {
      return
    }

    const match = amazonPathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    return resolvePathTarget(url, match.groups.target)
  },
})
