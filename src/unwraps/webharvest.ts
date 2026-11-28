import { createPathUnwrapper } from '../pathTarget.js'

// The collection, an end-of-term harvest such as peth04 or a congressional one such as
// congress117th, then a 14-digit timestamp.
const prefixRegex = /^\/(?:peth\d{2}|congress\d+th)\/\d{14}\//i

// NARA web harvest snapshot (webharvest.gov/<collection>/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapWebharvest = createPathUnwrapper({
  hosts: ['webharvest.gov', 'www.webharvest.gov'],
  prefix: prefixRegex,
})
