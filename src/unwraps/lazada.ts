import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/t\/c\.[A-Za-z0-9]+$/i

// Lazada affiliate link (c.lazada.<tld>/t/c.<id>?url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLazada = createQueryUnwrapper({
  hosts: [
    'c.lazada.co.id',
    'c.lazada.co.th',
    'c.lazada.com.my',
    'c.lazada.com.ph',
    'c.lazada.sg',
    'c.lazada.vn',
  ],
  path: pathRegex,
  params: ['url'],
})
