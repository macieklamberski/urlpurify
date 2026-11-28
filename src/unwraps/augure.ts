import { decodeBase64 } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// The account id, then a message id joined to the sender's domain.
const pathRegex = /^\/(?:pub|www)\/tracking\/\d+\/[^/]+$/i

// Augure, now Launchmetrics, email click tracker
// (web-engage.augure.com/pub/tracking/<account>/<message>?id1=<base64>). The id1 param is a
// percent-encoded target URL in MIME base64, whose line breaks atob skips.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAugure = createQueryUnwrapper({
  hosts: ['web-engage.augure.com', 'web-profilepr.engage.augure.com', 'wpp.engage.augure.com'],
  path: pathRegex,
  params: ['id1'],
  decode: decodeBase64,
})
