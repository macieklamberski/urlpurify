import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i

const baseExtractor = createParamExtractor({
  hosts: /\.acemln[a-d]\.com$/,
  path: '/Prod/link-tracker',
  params: ['redirectUrl'],
})

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>). The redirectUrl param is base64 of the target, plain or percent-encoded,
// or the plain target itself.
export const unwrapAceml: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  let decoded = decodeBase64(raw)

  if (decoded && encodedSchemeRegex.test(decoded)) {
    try {
      decoded = decodeURIComponent(decoded)
    } catch {}
  }

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }

  if (isHttpUrl(raw)) {
    return raw
  }
}
