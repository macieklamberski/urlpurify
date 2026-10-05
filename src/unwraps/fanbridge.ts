import { createParamExtractor } from '../utils.js'

// FanBridge mailing-list click tracker (clicks.fanbridge.com/l.php?cid=<id>&sid=<id>&url=<target>).
// Opt-in: an email click tracker, like the others in its group.
export const unwrapFanbridge = createParamExtractor({
  hosts: 'clicks.fanbridge.com',
  path: '/l.php',
  params: ['url'],
})
