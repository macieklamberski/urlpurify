import { createParamExtractor } from '../utils.js'

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>), on both
// domains and every subdomain.
export const unwrapIndexHu = createParamExtractor({
  domains: ['index.hu', 'dex.hu'],
  path: '/x.php',
  params: ['url'],
})
