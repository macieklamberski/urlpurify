import { createParamExtractor } from '../utils.js'

// Constant Contact email click tracker (r20.rs6.net/tn.jsp?t=<id>&p=<target>, also rs6.net). Only
// older links carry the target. Opt-in: unwrapping removes the sender's click count.
export const unwrapConstantContact = createParamExtractor({
  hosts: ['r20.rs6.net', 'rs6.net'],
  path: '/tn.jsp',
  params: ['p'],
})
