import { createQueryUnwrapper } from '../utils.js'

// Adrecord affiliate click (click.adrecord.com/?c=<id>&p=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAdrecord = createQueryUnwrapper({
  hosts: 'click.adrecord.com',
  path: '/',
  params: ['url'],
})
