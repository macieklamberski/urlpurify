import { createParamExtractor } from '../utils.js'

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>).
export const unwrapIndexHu = createParamExtractor({
  hosts: /(^|\.)(index|dex)\.hu$/,
  path: '/x.php',
  params: ['url'],
})
