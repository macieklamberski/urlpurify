import { createQueryUnwrapper } from '../utils.js'

// Douban external link redirect (www.douban.com/link2/?url=<target>, also on book.douban.com and
// dongxi.douban.com).
export const unwrapDouban = createQueryUnwrapper({
  hosts: ['douban.com', 'www.douban.com', 'book.douban.com', 'dongxi.douban.com'],
  path: '/link2/',
  params: ['url'],
})
