import { decodeBase64, decodePercent } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// The account id, then a message id joined to the sender's domain.
const pathRegex = /^\/(?:pub|www)\/tracking\/\d+\/[^/]+$/i

const decodeTarget = (value: string): string | undefined => {
  const decoded = decodeBase64(value)

  if (!decoded) {
    return
  }

  return decodePercent(decoded)
}

// Augure, now Launchmetrics, email click tracker
// (web-engage.augure.com/pub/tracking/<account>/<message>?id1=<base64>). The id1 param is a
// percent-encoded target URL in MIME base64, whose line breaks atob skips. Opt-in: unwrapping
// drops the sender's click count, as with the other email trackers.
export const unwrapAugure = createQueryUnwrapper({
  hosts: ['web-engage.augure.com', 'web-profilepr.engage.augure.com', 'wpp.engage.augure.com'],
  path: pathRegex,
  params: ['id1'],
  decode: decodeTarget,
})
