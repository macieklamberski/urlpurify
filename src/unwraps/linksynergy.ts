import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

// linksynergy.jrs5.com and linksynergy.walmart.com sit on a merchant's own domain.
const hosts = ['click.linksynergy.com', 'linksynergy.jrs5.com', 'linksynergy.walmart.com']

const carrierParams: Record<string, string> = {
  '/deeplink': 'murl',
  '/link': 'murl',
  '/fs-bin/click': 'RD_PARM1',
  '/fs-bin/stat': 'RD_PARM1',
}

// LinkSynergy (Rakuten) affiliate redirect on click.linksynergy.com and two merchant hosts:
// /deeplink?murl=<target>, /link?murl=<target> and /fs-bin/{click,stat}?RD_PARM1=<target>. Not in
// defaultUnwrappers: it is an affiliate link.
export const unwrapLinksynergy: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const param = carrierParams[url.pathname.toLowerCase()]

    if (!param) {
      return
    }

    return getParamTarget(url, param)
  },
})
