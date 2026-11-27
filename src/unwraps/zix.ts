import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// A hex digest, then the link id.
const linkPathRegex = /^\/u\/[0-9a-f]{8}\/[A-Za-z0-9_-]+$/i

const hosts = ['link.zixcentral.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['u'],
})

// Zix email link protection (link.zixcentral.com/u/<digest>/<id>?u=<target>), a "Checking link"
// page that posts on to the target. Opt-in, as the other email security gateways.
export const unwrapZix = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!linkPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
