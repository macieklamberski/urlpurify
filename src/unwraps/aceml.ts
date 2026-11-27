import { decodeBase64, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import {
  createUnwrapper,
  decodeEncodedScheme,
  getDecodedParamTarget,
  readParamTarget,
} from '../utils.js'

const hostRegex = /\.acemln[a-d]\.com$/

const decodeTarget = (value: string): string | undefined => {
  const decoded = decodeBase64(value)

  if (!decoded) {
    return
  }

  return decodeEncodedScheme(decoded)
}

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>). The redirectUrl param is base64 of the target, plain or percent-encoded,
// or the plain target itself.
export const unwrapAceml: UrlUnwrapper = createUnwrapper({
  hosts: hostRegex,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/Prod/link-tracker')) {
      return
    }

    const target = getDecodedParamTarget(url, 'redirectUrl', decodeTarget)

    if (target) {
      return target
    }

    const raw = readParamTarget(url, 'redirectUrl')

    if (raw && isHttpUrl(raw)) {
      return raw
    }
  },
})
