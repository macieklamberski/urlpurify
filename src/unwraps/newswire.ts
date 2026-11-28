import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// Newswire release and email click tracker (stats.newswire.com/x/html?final=<base64url>&sig=…,
// also stats.nwe.io and stats.mediadboutreach.com).
// Opt-in: unwrapping removes the issuer's click stats from the wire.
export const unwrapNewswire = createQueryUnwrapper({
  hosts: ['stats.newswire.com', 'stats.nwe.io', 'stats.mediadboutreach.com'],
  path: '/x/html',
  params: ['final'],
  decode: decodeBase64Url,
})
