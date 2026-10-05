import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex =
  /^\/api\/v1\/messages\/tracking\/click\/[0-9a-f]{24}\/[0-9a-f]{24}\/[0-9a-f]{24}\/$/

const extractTarget = createParamExtractor({
  hosts: 'app.nimble.com',
  params: ['redirect'],
})

// Nimble CRM email click tracker
// (app.nimble.com/api/v1/messages/tracking/click/<id>/<id>/<id>/?redirect=<target>). Opt-in:
// unwrapping removes the sender's click count.
export const unwrapNimble: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
