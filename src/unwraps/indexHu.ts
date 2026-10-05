import { createParamExtractor } from '../utils.js'

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>), on dex.hu,
// index.hu and vakbarat.index.hu.
export const unwrapIndexHu = createParamExtractor({
  hosts: ['dex.hu', 'index.hu', 'vakbarat.index.hu'],
  path: '/x.php',
  params: ['url'],
})
