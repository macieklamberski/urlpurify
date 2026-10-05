import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/t\/c\.[A-Za-z0-9]+$/

const extractTarget = createParamExtractor({
  hosts: [
    'c.lazada.co.id',
    'c.lazada.co.th',
    'c.lazada.com.my',
    'c.lazada.com.ph',
    'c.lazada.sg',
    'c.lazada.vn',
  ],
  params: ['url'],
})

// Lazada affiliate link (c.lazada.<tld>/t/c.<id>?url=<target>).
// Opt-in: unwrapping drops the affiliate's commission.
export const unwrapLazada: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
