import { createPathUnwrapper } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the web archive prefix.
const prefixRegex = /^\/webarchive\/\d{14}\//i

// National Library of New Zealand web archive snapshot
// (ndhadeliver.natlib.govt.nz/webarchive/<timestamp>/<target>). Opt-in: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapNatlibNz: UrlUnwrapper = createPathUnwrapper({
  hosts: 'ndhadeliver.natlib.govt.nz',
  prefix: prefixRegex,
})
