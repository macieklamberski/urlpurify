import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

// translate.google.<TLD> and its www. host, the hosts the walk shows on the translate paths.
const googleTranslateHostRegex =
  /^(?:www\.)?translate\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

const googleTranslatePaths = ['/translate', '/website']

const proxyHostSuffix = '.translate.goog'
const proxyLabelRegex = /^[a-z0-9-]+$/
// A host that does not fit the dashed form gets a hashed label, <base32>-<hash>-<host part>,
// which does not decode back to the host.
const hashedLabelRegex = /^[a-z2-7]{26}-[a-z0-9]{15}-/
const proxyParamPrefix = '_x_tr_'

// The website proxy names the target host in its own subdomain, `.` as `-` and `-` as `--`, so
// every subdomain of translate.goog is a proxied site. A long host moves its start into the
// _x_tr_hp param, and _x_tr_enc marks a `1-` prefix to drop or a `0-` prefix that stands for
// the `xn--` of an IDN host.
const unwrapWebsiteProxy: UrlUnwrapper = (url) => {
  if (!url.hostname.endsWith(proxyHostSuffix)) {
    return
  }

  const label = url.hostname.slice(0, -proxyHostSuffix.length)

  if (!proxyLabelRegex.test(label) || hashedLabelRegex.test(label)) {
    return
  }

  const encodings = url.searchParams.get(`${proxyParamPrefix}enc`)?.split(',') ?? []
  let prefix = `${url.searchParams.get(`${proxyParamPrefix}hp`) ?? ''}${label}`

  if (encodings.includes('1') && prefix.startsWith('1-')) {
    prefix = prefix.slice(2)
  }

  const isIdn = encodings.includes('0') && prefix.startsWith('0-')

  if (isIdn) {
    prefix = prefix.slice(2)
  }

  const host = `${isIdn ? 'xn--' : ''}${prefix.replaceAll(/\b-\b/g, '.').replaceAll('--', '-')}`
  const scheme = url.searchParams.get(`${proxyParamPrefix}sch`) === 'http' ? 'http' : 'https'
  const query = url.search
    .slice(1)
    .split('&')
    .filter((part) => part && !part.startsWith(proxyParamPrefix))
    .join('&')

  return `${scheme}://${host}${url.pathname}${query ? `?${query}` : ''}${url.hash}`
}

// Google Translate ([www.]translate.google.<TLD>/translate?u=<target> and /website?u=<target>),
// its translated frame (translate.googleusercontent.com/translate_c?u=<target>), and its website
// proxy (<dashed host>.translate.goog/<path>?_x_tr_sl=<lang>), rebuilt without the _x_tr_ params.
// Opt-in: it renders the target translated, so unwrapping discards the translation the user
// wanted.
export const unwrapGoogleTranslate: UrlUnwrapper = (url) => {
  const proxyTarget = unwrapWebsiteProxy(url)

  if (proxyTarget) {
    return proxyTarget
  }

  const isTranslatePage =
    isAnyOf(url.hostname, googleTranslateHostRegex) && googleTranslatePaths.includes(url.pathname)
  // googleusercontent.com gives third parties subdomains, such as Apps Script web apps.
  const isTranslateFrame =
    isHostOf(url, 'translate.googleusercontent.com') && url.pathname === '/translate_c'

  if (!isTranslatePage && !isTranslateFrame) {
    return
  }

  const target = getParamValues(url, 'u').at(0)

  if (!target) {
    return
  }

  return target
}
