import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64 } from '../utils.js'

// XenGenTr external link redirect add-on for XenForo, on each forum's own host
// (<host>/yonlendirme?to=<base64>). The to param is a base64-encoded target URL.
export const unwrapXengentr: UrlUnwrapper = (url) => {
  if (url.pathname !== '/yonlendirme') {
    return
  }

  const raw = url.searchParams.get('to')

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
