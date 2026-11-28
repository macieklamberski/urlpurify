import { createUnwrapper, readParamTarget } from '../utils.js'

// linksynergy.jrs5.com and linksynergy.walmart.com sit on a merchant's own domain.
const hosts = ['click.linksynergy.com', 'linksynergy.jrs5.com', 'linksynergy.walmart.com']

const carrierParams: Record<string, string> = {
  '/deeplink': 'murl',
  '/link': 'murl',
  '/fs-bin/click': 'RD_PARM1',
  '/fs-bin/stat': 'RD_PARM1',
}

// LinkSynergy (Rakuten) affiliate redirect on click.linksynergy.com and two merchant hosts:
// /deeplink?murl=<target>, /link?murl=<target> and /fs-bin/{click,stat}?RD_PARM1=<target>.
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLinksynergy = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const param = carrierParams[url.pathname.toLowerCase()]

    if (!param) {
      return
    }

    return readParamTarget(url, param)
  },
})
