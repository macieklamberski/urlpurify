import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const hostRegex = /^mail\.yandex\.(?:com\.tr|[a-z]{2,3})$/

// Yandex Mail link redirect (mail.yandex.<TLD>/re.jsx?l=<base64url>&h=<signature>).
export const unwrapYandexMail: UrlUnwrapper = (url) => {
  if (!hostRegex.test(url.hostname) || url.pathname !== '/re.jsx') {
    return
  }

  const value = url.searchParams.get('l')

  if (!value) {
    return
  }

  const decoded = decodeBase64Url(value)

  if (!decoded || !isHttpUrl(decoded)) {
    return
  }

  return decoded
}
