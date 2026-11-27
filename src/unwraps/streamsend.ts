import { createQueryUnwrapper } from '../utils.js'

// Some senders left the recipient hash unrendered, such as `{{{tracking_hash}}}`, so the two
// hash segments take any characters.
const clickPathRegex = /^\/c\/\d+\/\d+\/[^/]+\/[^/]+$/i

// StreamSend email click tracker (app.streamsend.com/c/<n>/<n>/<hash>/<hash>?redirect_to=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapStreamsend = createQueryUnwrapper({
  hosts: ['app.streamsend.com'],
  path: clickPathRegex,
  params: ['redirect_to'],
})
