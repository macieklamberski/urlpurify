import { createPathUnwrapper } from '../pathTarget.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier, or `+` for the latest.
const prefixRegex = /^(?:\/ukgwa)?\/(?:\d{14}(?:mp_)?|\+)\//i

// UK Government Web Archive snapshot (webarchive.nationalarchives.gov.uk/[ukgwa/]<timestamp>[mp_]/
// <target>, or `+` for the latest), with or without the target's scheme.
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapUkgwa = createPathUnwrapper({
  hosts: 'webarchive.nationalarchives.gov.uk',
  prefix: prefixRegex,
  scheme: 'http', // The archive's replay page names a target stored with no scheme as an http url
})
