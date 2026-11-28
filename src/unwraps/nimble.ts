import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex =
  /^\/api\/v1\/messages\/tracking\/click\/[0-9a-f]{24}\/[0-9a-f]{24}\/[0-9a-f]{24}\/$/i

// Nimble CRM email click tracker
// (app.nimble.com/api/v1/messages/tracking/click/<id>/<id>/<id>/?redirect=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapNimble = createQueryUnwrapper({
  hosts: 'app.nimble.com',
  path: clickPathRegex,
  params: ['redirect'],
})
