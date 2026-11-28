import { createQueryUnwrapper } from '../utils.js'

// 12ft paywall proxy (12ft.io/proxy?q=<target>).
// Opt-in: unwrapping returns the live page, not the copy. The proxy serves a page the reader may
// not otherwise see.
export const unwrap12ft = createQueryUnwrapper({
  hosts: ['12ft.io', 'www.12ft.io'],
  path: '/proxy',
  params: ['q'],
})
