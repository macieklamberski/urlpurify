import { createParamExtractor } from '../utils.js'

// ncls1.com affiliate click (ncls1.com/irk?enk=<encoded ids>&subid=<site>&d=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapNcls = createParamExtractor({
  hosts: 'ncls1.com',
  path: '/irk',
  params: ['d'],
})
