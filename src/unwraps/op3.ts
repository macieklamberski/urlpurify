import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/e(?:,[^/]*)?\//i

// OP3 download measurement prefix (op3.dev/e/<target> and op3.dev/e,<params>/<target>), where
// the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapOp3 = createPathUnwrapper({
  hosts: ['op3.dev', 'www.op3.dev'],
  prefix: episodePrefixRegex,
})
