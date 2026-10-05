import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Salesflare email link tracking (llink.to/?u=<target>&e=<recipient id>). Opt-in: unwrapping removes
// the sender's click count.
export const unwrapSalesflare: UrlUnwrapper = createParamExtractor({
  hosts: 'llink.to',
  path: '/',
  params: ['u'],
})
