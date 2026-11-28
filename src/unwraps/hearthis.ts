import { createQueryUnwrapper } from '../utils.js'

// hearthis.at outbound link shim on profile and track descriptions
// (hearthis.at/l.php?url=<target>).
export const unwrapHearthis = createQueryUnwrapper({
  hosts: ['app.hearthis.at', 'hearthis.at', 'www.hearthis.at'],
  path: '/l.php',
  params: ['url'],
})
