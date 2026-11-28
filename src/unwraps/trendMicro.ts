import { createQueryUnwrapper } from '../utils.js'

// Trend Micro Click Time Protection (<product>-ctp.trendmicro.com/wis/clicktime/v1/query
// ?url=<target>, also on cas5-0-urlprotect.trendmicro.com), one host per product and version.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapTrendMicro = createQueryUnwrapper({
  hosts: [
    'cas5-0-urlprotect.trendmicro.com',
    'ddec1-0-en-ctp.trendmicro.com',
    'ddei5-0-ctp.trendmicro.com',
    'hes32-ctp.trendmicro.com',
    'imsva91-ctp.trendmicro.com',
    'smex-ctp.trendmicro.com',
    'smex12-5-en-ctp.trendmicro.com',
  ],
  path: '/wis/clicktime/v1/query',
  params: ['url'],
})
