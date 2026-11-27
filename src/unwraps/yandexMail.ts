import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// Yandex Mail link redirect (mail.yandex.<TLD>/re.jsx?l=<base64url>&h=<signature>).
export const unwrapYandexMail = createQueryUnwrapper({
  hosts: /^mail\.yandex\.(?:com\.tr|[a-z]{2,3})$/,
  path: '/re.jsx',
  params: ['l'],
  decode: decodeBase64Url,
})
