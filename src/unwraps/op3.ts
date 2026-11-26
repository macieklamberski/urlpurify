import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const episodePrefixRegex = /^\/e(?:,[^/]*)?\//i

// OP3 download measurement prefix (op3.dev/e/<target> and op3.dev/e,<params>/<target>), where
// the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapOp3: UrlUnwrapper = createUnwrapper({
  hosts: 'op3.dev',
  unwrap: (url) => {
    return getPathTarget(url, episodePrefixRegex)
  },
})
