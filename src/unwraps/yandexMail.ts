import { decodeBase64Url, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target } from '../utils.js'

const hostRegex = /^mail\.yandex\.(?:com\.tr|[a-z]{2,3})$/

// Yandex Mail link redirect (mail.yandex.<TLD>/re.jsx?l=<base64url>&h=<signature>).
export const unwrapYandexMail: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hostRegex) || !isAnyOf(url.pathname, '/re.jsx')) {
    return
  }

  return getBase64Target(url, 'l', decodeBase64Url)
}
