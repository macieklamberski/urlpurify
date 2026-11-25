import { decodeBase64Url, isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const hostRegex = /^mail\.yandex\.(?:com\.tr|[a-z]{2,3})$/

// Yandex Mail link redirect (mail.yandex.<TLD>/re.jsx?l=<base64url>&h=<signature>).
export const unwrapYandexMail: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hostRegex) || !isAnyOf(url.pathname, '/re.jsx')) {
    return
  }

  const value = getParamValues(url, 'l').at(0)

  if (!value) {
    return
  }

  const decoded = decodeBase64Url(value)

  if (!decoded || !isHttpUrl(decoded)) {
    return
  }

  return decoded
}
