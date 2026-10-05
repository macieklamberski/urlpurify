import { createParamExtractor } from '../utils.js'

// Ehub affiliate click (ehub.cz/system/scripts/click.php?a_aid=<id>&a_bid=<id>&desturl=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEhub = createParamExtractor({
  hosts: 'ehub.cz',
  path: '/system/scripts/click.php',
  params: ['desturl'],
})
