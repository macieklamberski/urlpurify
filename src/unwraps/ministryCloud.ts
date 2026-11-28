import { createPathUnwrapper } from '../pathTarget.js'

// The segment after r/ is a base64 JSON id naming the site, sermon and media file.
const mediaPrefixRegex = /^\/r\/[^/]+\//i

// MinistryCloud sermon media download counter (historian.ministrycloud.com/r/<media id>/<target>),
// where the target mostly keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes the church's download counts.
export const unwrapMinistryCloud = createPathUnwrapper({
  hosts: 'historian.ministrycloud.com',
  prefix: mediaPrefixRegex,
  scheme: 'http', // The redirect names http for a target with no scheme, probed 2026-11-28
})
