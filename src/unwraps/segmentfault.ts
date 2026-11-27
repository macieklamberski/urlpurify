import { decodeBase64 } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// Segmentfault external link redirect (link.segmentfault.com/?enc=<base64>). The enc param is a
// base64-encoded target URL.
export const unwrapSegmentfault = createQueryUnwrapper({
  hosts: 'link.segmentfault.com',
  path: '/',
  params: ['enc'],
  decode: decodeBase64,
})
