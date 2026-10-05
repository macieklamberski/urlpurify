import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const episodePrefixRegex = /^\/e(?:,[^/]*)?\//

// OP3 download measurement prefix (op3.dev/e/<target> and op3.dev/e,<params>/<target>), where
// the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapOp3: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'op3.dev')) {
    return
  }

  return getPathTarget(url, episodePrefixRegex)
}
