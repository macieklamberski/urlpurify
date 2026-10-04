import { createParamExtractor } from '../utils.js'

// 12ft paywall proxy (12ft.io/proxy?q=<target>), on the domain and every subdomain.
// Not included in defaultUnwrappers: the proxy serves a page the reader may not otherwise see.
export const unwrap12ft = createParamExtractor({
  domains: '12ft.io',
  path: '/proxy',
  params: ['q'],
})
