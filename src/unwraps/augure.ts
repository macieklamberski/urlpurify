import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: ['web-engage.augure.com', 'web-profilepr.engage.augure.com', 'wpp.engage.augure.com'],
  params: ['id1'],
})

// The account id, then a message id joined to the sender's domain.
const pathRegex = /^\/(?:pub|www)\/tracking\/\d+\/[^/]+$/

// Augure, now Launchmetrics, email click tracker
// (web-engage.augure.com/pub/tracking/<account>/<message>?id1=<base64>). The id1 param is a
// percent-encoded target URL in MIME base64, whose line breaks atob skips. Opt-in: unwrapping
// drops the sender's click count, as with the other email trackers.
export const unwrapAugure: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (!decoded) {
    return
  }

  let target: string

  try {
    target = decodeURIComponent(decoded)
  } catch {
    return
  }

  if (isHttpUrl(target)) {
    return target
  }
}
