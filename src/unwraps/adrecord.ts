import { createParamExtractor } from '../utils.js'

// Adrecord affiliate click (click.adrecord.com/?c=<id>&p=<id>&url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAdrecord = createParamExtractor({
  hosts: 'click.adrecord.com',
  path: '/',
  params: ['url'],
})
