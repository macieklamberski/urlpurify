import { createPathUnwrapper } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the web prefix.
const prefixRegex = /^\/web\/\d{14}\//i

// Library and Archives Canada web archive snapshot
// (webarchiveweb.wayback.bac-lac.canada.ca/web/<timestamp>/<target>). Opt-in: unwrapping returns
// the live page, which may have changed or be gone.
export const unwrapBacLacWebArchive: UrlUnwrapper = createPathUnwrapper({
  hosts: 'webarchiveweb.wayback.bac-lac.canada.ca',
  prefix: prefixRegex,
})
