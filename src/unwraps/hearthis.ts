import { createParamExtractor } from '../utils.js'

// hearthis.at outbound link shim on profile and track descriptions
// (hearthis.at/l.php?url=<target>).
export const unwrapHearthis = createParamExtractor({
  hosts: ['app.hearthis.at', 'hearthis.at'],
  path: '/l.php',
  params: ['url'],
})
