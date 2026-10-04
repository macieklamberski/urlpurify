import { createParamExtractor } from '../utils.js'

// AvantLink affiliate click redirect (www.avantlink.com/click.php?url=<target>, also on
// classic.avantlink.com). Opt-in: unwrapping removes the publisher's commission.
export const unwrapAvantlink = createParamExtractor({
  hosts: ['www.avantlink.com', 'classic.avantlink.com'],
  path: '/click.php',
  params: ['url'],
})
