import { createQueryUnwrapper } from '../utils.js'

// TradeTracker affiliate click (tc.tradetracker.net/?c=<campaign>&m=<material>&a=<affiliate>
// &u=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapTradetracker = createQueryUnwrapper({
  hosts: 'tc.tradetracker.net',
  path: '/',
  params: ['u'],
})
