import { createPathUnwrapper } from '../pathTarget.js'

// A 14-digit timestamp at the root.
const prefixRegex = /^\/\d{14}\//

// UNHCR web archive snapshot, which holds the retired Refworld site
// (webarchive.archive.unhcr.org/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapUnhcrWebArchive = createPathUnwrapper({
  hosts: 'webarchive.archive.unhcr.org',
  prefix: prefixRegex,
})
