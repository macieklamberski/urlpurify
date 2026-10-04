import { createParamExtractor } from '../utils.js'

// AvantLink affiliate click redirect (www.avantlink.com/click.php?url=<target>), on the domain and
// every subdomain. Opt-in: unwrapping removes the publisher's commission.
export const unwrapAvantlink = createParamExtractor({
  domains: 'avantlink.com',
  path: '/click.php',
  params: ['url'],
})
