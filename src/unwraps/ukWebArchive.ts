import { createPathUnwrapper } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier.
const prefixRegex = /^\/wayback\/(?:en\/)?archive\/\d{14}(?:mp_)?\//i

// UK Web Archive snapshot (www.webarchive.org.uk/wayback/[en/]archive/<timestamp>[mp_]/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapUkWebArchive: UrlUnwrapper = createPathUnwrapper({
  hosts: ['www.webarchive.org.uk', 'webarchive.org.uk'],
  prefix: prefixRegex,
})
