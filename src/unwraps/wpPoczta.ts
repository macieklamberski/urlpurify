import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// WP Poczta and o2 webmail dereferrer (zasobygwp.pl/redirect?sig=<sig>&url=<base64>). The url
// param is a base64url-encoded target URL.
export const unwrapWpPoczta = createQueryUnwrapper({
  hosts: ['zasobygwp.pl', 'www.zasobygwp.pl'],
  path: '/redirect',
  params: ['url'],
  decode: decodeBase64Url,
})
