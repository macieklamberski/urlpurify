import { createPathUnwrapper } from '../pathTarget.js'

// A 14-digit timestamp after the web archive prefix.
const prefixRegex = /^\/webarchive\/\d{14}\//i

// National Library of New Zealand web archive snapshot
// (ndhadeliver.natlib.govt.nz/webarchive/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapNatlibNz = createPathUnwrapper({
  hosts: 'ndhadeliver.natlib.govt.nz',
  prefix: prefixRegex,
})
