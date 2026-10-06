import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// A hex digest, then the link id.
const linkPathRegex = /^\/u\/[0-9a-f]{8}\/[A-Za-z0-9_-]+$/

const extractTarget = createParamExtractor({
  hosts: 'link.zixcentral.com',
  params: ['u'],
})

// Zix email link protection (link.zixcentral.com/u/<digest>/<id>?u=<target>), a "Checking link"
// page that posts on to the target. Opt-in, as the other email security gateways.
export const unwrapZix: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
