import { createQueryUnwrapper } from '../utils.js'

// Xianguo subscribe button (www.xianguo.com/subscribe.php?url=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapXianguo = createQueryUnwrapper({
  hosts: ['xianguo.com', 'www.xianguo.com'],
  path: '/subscribe.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
