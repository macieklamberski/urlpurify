import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/t\/c\.[A-Za-z0-9]+$/i

const hosts = [
  'c.lazada.co.id',
  'c.lazada.co.th',
  'c.lazada.com.my',
  'c.lazada.com.ph',
  'c.lazada.sg',
  'c.lazada.vn',
]

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Lazada affiliate link (c.lazada.<tld>/t/c.<id>?url=<target>).
// Opt-in: unwrapping drops the affiliate's commission.
export const unwrapLazada = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
