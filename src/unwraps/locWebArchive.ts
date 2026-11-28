import { createPathUnwrapper } from '../pathTarget.js'

// The collection name, then a 14-digit timestamp.
const prefixRegex = /^\/(?:all|legacy|congressional-record)\/\d{14}\//i

// Library of Congress Web Archives snapshot (webarchive.loc.gov/<collection>/<timestamp>/<target>,
// in the all, legacy and congressional-record collections).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapLocWebArchive = createPathUnwrapper({
  hosts: 'webarchive.loc.gov',
  prefix: prefixRegex,
})
