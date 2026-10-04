import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  domains: ['acemlna.com', 'acemlnb.com', 'acemlnc.com', 'acemlnd.com'],
  path: '/Prod/link-tracker',
  params: ['redirectUrl'],
})

// ActiveCampaign ACEML link tracker (<host>.acemln[a-d].com/Prod/link-tracker
// ?redirectUrl=<base64>), on each domain and every subdomain. The redirectUrl param is base64.
export const unwrapAceml: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
