import { createParamExtractor } from '../utils.js'

// Tradedoubler affiliate redirect (?url=<target> on /click at clk., clkuk., clkde. and tracker.
// tradedoubler.com).
export const unwrapTradedoubler = createParamExtractor({
  hosts: [
    'clk.tradedoubler.com',
    'clkuk.tradedoubler.com',
    'clkde.tradedoubler.com',
    'tracker.tradedoubler.com',
  ],
  path: '/click',
  params: ['url'],
})
