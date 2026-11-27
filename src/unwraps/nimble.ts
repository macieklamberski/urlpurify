import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPathRegex =
  /^\/api\/v1\/messages\/tracking\/click\/[0-9a-f]{24}\/[0-9a-f]{24}\/[0-9a-f]{24}\/$/i

const hosts = ['app.nimble.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['redirect'],
})

// Nimble CRM email click tracker
// (app.nimble.com/api/v1/messages/tracking/click/<id>/<id>/<id>/?redirect=<target>). Opt-in:
// unwrapping removes the sender's click count.
export const unwrapNimble = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
