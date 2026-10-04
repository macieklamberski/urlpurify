import { createParamExtractor } from '../utils.js'

// Tradedoubler affiliate redirect (clk.tradedoubler.com/click?url=<target>), on every subdomain,
// such as clkuk., clkde. and tracker.
export const unwrapTradedoubler = createParamExtractor({
  domains: 'tradedoubler.com',
  path: '/click',
  params: ['url'],
})
