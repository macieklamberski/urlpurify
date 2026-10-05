import { createParamExtractor } from '../utils.js'

// oo34.net affiliate click (td.oo34.net/cl/?tt=slg&aaid=<id>&paid=<id>&link=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapOo34 = createParamExtractor({
  hosts: 'td.oo34.net',
  path: '/cl/',
  params: ['link'],
})
