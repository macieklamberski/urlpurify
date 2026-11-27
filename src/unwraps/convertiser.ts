import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/click\/[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}\/$/i

// Convertiser affiliate click (converti.se/click/<id>-<id>-<id>/?deep_link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapConvertiser = createQueryUnwrapper({
  hosts: ['converti.se'],
  path: pathRegex,
  params: ['deep_link'],
})
