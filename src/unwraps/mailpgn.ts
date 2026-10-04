import { createParamExtractor } from '../utils.js'

// Campaign Monitor / mailpgn email tracker (t.mailpgn.com/l/?fl=<target>).
export const unwrapMailpgn = createParamExtractor({
  hosts: 't.mailpgn.com',
  path: '/l/',
  params: ['fl'],
})
