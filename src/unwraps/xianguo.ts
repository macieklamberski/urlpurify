import { createQueryUnwrapper } from '../utils.js'

// Xianguo subscribe button (www.xianguo.com/subscribe.php?url=<feed>). Opt-in: the button opens
// Xianguo's page that adds the feed, not the feed.
export const unwrapXianguo = createQueryUnwrapper({
  hosts: ['xianguo.com', 'www.xianguo.com'],
  path: '/subscribe.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
