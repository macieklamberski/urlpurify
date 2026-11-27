import { decodeBase64 } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// PRWeb release click tracker (www.prweb.net/Redirect.aspx?id=<base64>). The id param is a
// base64-encoded target URL.
export const unwrapPrweb = createQueryUnwrapper({
  hosts: 'www.prweb.net',
  path: '/Redirect.aspx',
  params: ['id'],
  decode: decodeBase64,
})
