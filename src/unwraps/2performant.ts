import { createQueryUnwrapper } from '../utils.js'

// 2Performant affiliate click (event.2performant.com/events/click?redirect_to=<target>, also the
// former event.2parale.ro).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrap2performant = createQueryUnwrapper({
  hosts: ['event.2performant.com', 'event.2parale.ro'],
  path: '/events/click',
  params: ['redirect_to'],
})
