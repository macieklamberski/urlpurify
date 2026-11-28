import { createQueryUnwrapper } from '../utils.js'

// FanBridge mailing-list click tracker (clicks.fanbridge.com/l.php?cid=<id>&sid=<id>&url=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapFanbridge = createQueryUnwrapper({
  hosts: 'clicks.fanbridge.com',
  path: '/l.php',
  params: ['url'],
})
