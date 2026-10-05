import { createParamExtractor } from '../utils.js'

// Uinterbox affiliate click on a merchant's tracking host
// (afiliadoscasadellibro.uinterbox.com/tracking/clk?act=<id>&pub=<id>&url=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapUinterbox = createParamExtractor({
  hosts: 'afiliadoscasadellibro.uinterbox.com',
  path: '/tracking/clk',
  params: ['url'],
})
