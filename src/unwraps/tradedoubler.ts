import { createParamExtractor } from '../utils.js'

// Tradedoubler affiliate redirect (clk.tradedoubler.com/click?url=<target>)
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
