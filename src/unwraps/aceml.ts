import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: /\.acemln[a-d]\.com$/,
  path: '/Prod/link-tracker',
  params: ['redirectUrl'],
})

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>). The redirectUrl param is base64-encoded.
export const unwrapAceml: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && (decoded.startsWith('http://') || decoded.startsWith('https://'))) {
    return decoded
  }
}
