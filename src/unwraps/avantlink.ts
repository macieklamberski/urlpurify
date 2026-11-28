import { createQueryUnwrapper } from '../utils.js'

// AvantLink affiliate click redirect (www.avantlink.com/click.php?url=<target>, also on
// classic.avantlink.com and the bare domain).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapAvantlink = createQueryUnwrapper({
  hosts: ['avantlink.com', 'www.avantlink.com', 'classic.avantlink.com'],
  path: '/click.php',
  params: ['url'],
})
