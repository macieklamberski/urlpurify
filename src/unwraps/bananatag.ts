import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/h\/(?:i\/[A-Za-z0-9]+\/)?[A-Za-z0-9]+$/

const extractTarget = createParamExtractor({
  hosts: ['s.bl-1.com', 's2.bl-1.com', 'microsoft.bl-1.com'],
  params: ['url'],
})

// Bananatag email click tracker (s.bl-1.com/h/<id>?url=<target>, also /h/i/<id>/<id>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapBananatag: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
