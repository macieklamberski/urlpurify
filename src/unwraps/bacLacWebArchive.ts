import { createPathUnwrapper } from '../pathTarget.js'

// A 14-digit timestamp after the web prefix.
const prefixRegex = /^\/web\/\d{14}\//i

// Library and Archives Canada web archive snapshot
// (webarchiveweb.wayback.bac-lac.canada.ca/web/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapBacLacWebArchive = createPathUnwrapper({
  hosts: 'webarchiveweb.wayback.bac-lac.canada.ca',
  prefix: prefixRegex,
})
