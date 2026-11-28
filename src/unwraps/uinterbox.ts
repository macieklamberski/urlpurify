import { createQueryUnwrapper } from '../utils.js'

// Uinterbox affiliate click on a merchant's tracking host
// (afiliadoscasadellibro.uinterbox.com/tracking/clk?act=<id>&pub=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapUinterbox = createQueryUnwrapper({
  hosts: 'afiliadoscasadellibro.uinterbox.com',
  path: '/tracking/clk',
  params: ['url'],
})
