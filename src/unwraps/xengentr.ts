import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target } from '../utils.js'

// XenGenTr external link redirect add-on for XenForo, on each forum's own host
// (<host>/yonlendirme?to=<base64>). The to param is a base64-encoded target URL.
export const unwrapXengentr: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, '/yonlendirme')) {
    return
  }

  return getBase64Target(url, 'to')
}
