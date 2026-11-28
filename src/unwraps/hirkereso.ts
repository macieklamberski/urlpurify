import { createQueryUnwrapper } from '../utils.js'

const redirectPathRegex = /^\/rd\/\d+$/i

// Hírkereső news aggregator click redirect (rd.hirkereso.hu/rd/<id>?partner=rss&url=<target>).
export const unwrapHirkereso = createQueryUnwrapper({
  hosts: 'rd.hirkereso.hu',
  path: redirectPathRegex,
  params: ['url'],
})
