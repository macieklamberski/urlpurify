import { decodeBase64 } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/api\/v1\/Click\/b\/[A-Za-z0-9]+$/i

// Digikala affiliate click (dgkl.io/api/v1/Click/b/<link id>?b64=<base64 target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapDigikala = createQueryUnwrapper({
  hosts: 'dgkl.io',
  path: pathRegex,
  params: ['b64'],
  decode: decodeBase64,
})
