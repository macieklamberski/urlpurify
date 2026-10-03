import { isHostOf, isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Merchant hosts that point at LinkSynergy. They sit on the merchant's own domain, so they match
// exactly.
const merchantHosts = ['linksynergy.jrs5.com', 'linksynergy.walmart.com']

const carrierParams: Record<string, string> = {
  '/deeplink': 'murl',
  '/link': 'murl',
  '/fs-bin/click': 'RD_PARM1',
  '/fs-bin/stat': 'RD_PARM1',
}

// LinkSynergy (Rakuten) affiliate redirect on linksynergy.com, its subdomains and merchant hosts:
// /deeplink?murl=<target>, /link?murl=<target> and /fs-bin/{click,stat}?RD_PARM1=<target>. Not in
// defaultUnwrappers: it is an affiliate link.
export const unwrapLinksynergy: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'linksynergy.com') && !isHostOf(url, merchantHosts)) {
    return
  }

  const param = carrierParams[url.pathname]

  if (!param) {
    return
  }

  const target = url.searchParams.get(param)

  if (!target) {
    return
  }

  if (isHttpUrl(target)) {
    return target
  }

  // The target is often percent-encoded twice.
  try {
    const decoded = decodeURIComponent(target)

    if (isHttpUrl(decoded)) {
      return decoded
    }
  } catch {}
}
