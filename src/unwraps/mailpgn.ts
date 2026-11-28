import { createQueryUnwrapper } from '../utils.js'

// Campaign Monitor / mailpgn email tracker (t.mailpgn.com/l/?fl=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapMailpgn = createQueryUnwrapper({
  hosts: 't.mailpgn.com',
  path: '/l/',
  params: ['fl'],
})
