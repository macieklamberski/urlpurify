import { createQueryUnwrapper } from '../utils.js'

// Gurunavi affiliate click (gaff.gurunavi.jp/track/gc.php?ga_bid=<id>&ga_pid=<id>&ga_red=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapGurunavi = createQueryUnwrapper({
  hosts: 'gaff.gurunavi.jp',
  path: '/track/gc.php',
  params: ['ga_red'],
})
