import { decodeBase64, isAnyOf } from 'trousse'
import { createUnwrapper, readDecodedParamTarget, readParamTarget } from '../utils.js'

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>). The redirectUrl param is base64 of the target, plain or percent-encoded,
// or the plain target itself.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAceml = createUnwrapper({
  subdomains: ['acemlna.com', 'acemlnb.com', 'acemlnc.com', 'acemlnd.com'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/Prod/link-tracker')) {
      return
    }

    const target = readDecodedParamTarget(url, 'redirectUrl', decodeBase64)

    if (target) {
      return target
    }

    return readParamTarget(url, 'redirectUrl')
  },
})
