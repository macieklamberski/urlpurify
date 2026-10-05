import { createParamExtractor } from '../utils.js'

// 2Performant affiliate click (event.2performant.com/events/click?redirect_to=<target>, also the
// former event.2parale.ro). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrap2performant = createParamExtractor({
  hosts: ['event.2performant.com', 'event.2parale.ro'],
  path: '/events/click',
  params: ['redirect_to'],
})
