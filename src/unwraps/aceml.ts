import { decodeBase64, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readDecodedTarget, readParamTarget } from '../utils.js'

const hostRegex = /\.acemln[a-d]\.com$/

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>). The redirectUrl param is base64 of the target, plain or percent-encoded,
// or the plain target itself.
export const unwrapAceml: UrlUnwrapper = createUnwrapper({
  hosts: hostRegex,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/Prod/link-tracker')) {
      return
    }

    const target = readDecodedTarget(url, 'redirectUrl', decodeBase64)

    if (target) {
      return target
    }

    return readParamTarget(url, 'redirectUrl')
  },
})
