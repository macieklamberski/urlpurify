import { createQueryUnwrapper } from '../utils.js'

// Salesflare email link tracking (llink.to/?u=<target>&e=<recipient id>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapSalesflare = createQueryUnwrapper({
  hosts: ['llink.to', 'www.llink.to'],
  path: '/',
  params: ['u'],
})
