import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/mail_track\/link\/[^/]+$/

const extractTarget = createParamExtractor({
  hosts: /^(?:www\.)?cloudhq-mkt\d+\.(?:net|us)$/,
  params: ['url'],
})

// cloudHQ Gmail mail-merge click tracker (cloudhq-mkt<n>.net/mail_track/link/<id>?url=<target>, also
// www. and cloudhq-mkt<n>.us). Opt-in: unwrapping removes the sender's click count.
export const unwrapCloudhq: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
