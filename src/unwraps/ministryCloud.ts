import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The segment after r/ is a base64 JSON id naming the site, sermon and media file.
const mediaPrefixRegex = /^\/r\/[^/]+\//i

// MinistryCloud sermon media download counter (historian.ministrycloud.com/r/<media id>/<target>),
// where the target mostly keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes the church's download counts.
export const unwrapMinistryCloud: UrlUnwrapper = createUnwrapper({
  hosts: 'historian.ministrycloud.com',
  unwrap: (url) => {
    return getPathTarget(url, mediaPrefixRegex, 'http:')
  },
})
