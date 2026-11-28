import { createPathUnwrapper } from '../pathTarget.js'

// A 14-digit timestamp after the web prefix.
const prefixRegex = /^\/web\/\d{14}\//i

// UNESCO web archive snapshot (webarchive.unesco.org/web/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapUnescoWebArchive = createPathUnwrapper({
  hosts: 'webarchive.unesco.org',
  prefix: prefixRegex,
})
