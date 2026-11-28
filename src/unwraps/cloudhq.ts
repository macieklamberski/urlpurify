import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/mail_track\/link\/[^/]+$/i

// cloudHQ Gmail mail-merge click tracker (cloudhq-mkt<n>.net/mail_track/link/<id>?url=<target>,
// also www. and cloudhq-mkt<n>.us).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapCloudhq = createQueryUnwrapper({
  hosts: /^(?:www\.)?cloudhq-mkt\d+\.(?:net|us)$/,
  path: clickPathRegex,
  params: ['url'],
})
