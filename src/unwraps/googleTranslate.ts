import {
  getQueryParam,
  getSubdomain,
  isAnyOf,
  isBrandDomainOf,
  isHostOf,
  startsWithAnyOf,
} from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const googleTranslatePaths = ['/translate', '/website']

const proxyDomains = ['translate.goog']
// googleusercontent.com gives third parties subdomains, such as Apps Script web apps.
const frameHosts = ['translate.googleusercontent.com']
const proxyParamPrefix = '_x_tr_'

const proxyLabelRegex = /^[a-z0-9-]+$/
// A host that does not fit the dashed form gets a hashed label, <base32>-<hash>-<host part>,
// which does not decode back to the host.
const hashedLabelRegex = /^[a-z2-7]{26}-[a-z0-9]{15}-/
// A single `-` between two word characters stands for a `.` of the host.
const singleDashRegex = /\b-\b/g

// The website proxy names the target host in its own subdomain, `.` as `-` and `-` as `--`, so
// every subdomain of translate.goog is a proxied site. A long host moves its start into the
// _x_tr_hp param, and _x_tr_enc marks a `1-` prefix to drop or a `0-` prefix that stands for
// the `xn--` of an IDN host.
const extractWebsiteProxy: UrlUnwrapper = (url) => {
  const label = getSubdomain(url, proxyDomains)

  if (!label || !proxyLabelRegex.test(label) || hashedLabelRegex.test(label)) {
    return
  }

  const encodings = getQueryParam(url, `${proxyParamPrefix}enc`)?.split(',') ?? []
  let prefix = `${getQueryParam(url, `${proxyParamPrefix}hp`) ?? ''}${label}`

  if (encodings.includes('1') && prefix.startsWith('1-')) {
    prefix = prefix.slice(2)
  }

  const isIdn = encodings.includes('0') && prefix.startsWith('0-')

  if (isIdn) {
    prefix = prefix.slice(2)
  }

  const host = `${isIdn ? 'xn--' : ''}${prefix.replaceAll(singleDashRegex, '.').replaceAll('--', '-')}`
  const scheme = getQueryParam(url, `${proxyParamPrefix}sch`) === 'http' ? 'http' : 'https'
  const query = url.search
    .slice(1)
    .split('&')
    .filter((part) => part && !startsWithAnyOf(part, proxyParamPrefix))
    .join('&')

  return `${scheme}://${host}${url.pathname}${query ? `?${query}` : ''}`
}

// Google Translate ([www.]translate.google.<TLD>/translate?u=<target> and /website?u=<target>),
// its translated frame (translate.googleusercontent.com/translate_c?u=<target>), and its website
// proxy (<dashed host>.translate.goog/<path>?_x_tr_sl=<lang>), rebuilt without the _x_tr_ params.
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapGoogleTranslate = createUnwrapper({
  brands: 'google',
  hosts: frameHosts,
  subdomains: proxyDomains,
  // translate.google.<TLD> and its www. host as the walk shows them, the frame host and the proxy.
  match:
    /^(?:(?:www\.)?translate\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)|translate\.googleusercontent\.com|.+\.translate\.goog)$/,
  unwrap: (url) => {
    const proxyTarget = extractWebsiteProxy(url)

    if (proxyTarget) {
      return proxyTarget
    }

    const isTranslatePage =
      isBrandDomainOf(url, 'google') && isAnyOf(url.pathname, googleTranslatePaths)
    const isTranslateFrame = isHostOf(url, frameHosts) && isAnyOf(url.pathname, '/translate_c')

    if (!isTranslatePage && !isTranslateFrame) {
      return
    }

    return readParamTarget(url, 'u')
  },
})
