import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// Some senders left the recipient hash unrendered, such as `{{{tracking_hash}}}`, so the two
// hash segments take any characters.
const clickPathRegex = /^\/c\/\d+\/\d+\/[^/]+\/[^/]+$/i

const hosts = ['app.streamsend.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['redirect_to'],
})

// StreamSend email click tracker (app.streamsend.com/c/<n>/<n>/<hash>/<hash>?redirect_to=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapStreamsend = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
