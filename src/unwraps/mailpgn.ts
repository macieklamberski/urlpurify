import { createParamExtractor } from '../utils.js'

// Campaign Monitor / mailpgn email tracker (t.mailpgn.com/l/?fl=<target>), on mailpgn.com and its
// subdomains.
export const unwrapMailpgn = createParamExtractor({
  domains: 'mailpgn.com',
  path: '/l/',
  params: ['fl'],
})
