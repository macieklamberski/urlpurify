import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// igafnl.com newsletter click tracker (igafnl.com/click?redirect=<target>&dID=<n>&hashId=<hash>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapIgafnl: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'igafnl.com',
  path: '/click',
  params: ['redirect'],
})
