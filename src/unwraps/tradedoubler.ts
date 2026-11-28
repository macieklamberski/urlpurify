import { createQueryUnwrapper } from '../utils.js'

// Tradedoubler affiliate redirect (?url=<target> on /click at clk., clkuk., clkde. and tracker.
// tradedoubler.com).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapTradedoubler = createQueryUnwrapper({
  hosts: [
    'clk.tradedoubler.com',
    'clkuk.tradedoubler.com',
    'clkde.tradedoubler.com',
    'tracker.tradedoubler.com',
  ],
  path: '/click',
  params: ['url'],
})
