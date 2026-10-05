import { createParamExtractor } from '../utils.js'

// Trend Micro Click Time Protection (<product>-ctp.trendmicro.com/wis/clicktime/v1/query
// ?url=<target>, also on <product>-urlprotect.trendmicro.com), with one host per product and
// version, such as ddec1-0-en-ctp, smex-ctp, imsva91-ctp and cas5-0-urlprotect.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapTrendMicro = createParamExtractor({
  hosts: /^[a-z0-9-]+-(?:ctp|urlprotect)\.trendmicro\.com$/,
  path: '/wis/clicktime/v1/query',
  params: ['url'],
})
