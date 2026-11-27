import { createQueryUnwrapper } from '../utils.js'

// ncls1.com affiliate click (ncls1.com/irk?enk=<encoded ids>&subid=<site>&d=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapNcls = createQueryUnwrapper({
  hosts: 'ncls1.com',
  path: '/irk',
  params: ['d'],
  // A click nested unencoded in `d` spills its own `d` into this query, so the last one holds the
  // target.
  index: -1,
})
