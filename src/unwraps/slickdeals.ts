import { createQueryUnwrapper } from '../utils.js'

// Slickdeals outbound deal link (slickdeals.net/?sdtid=<id>&u2=<target>).
// Not included in defaultUnwrappers: Slickdeals earns a commission on the outbound click.
export const unwrapSlickdeals = createQueryUnwrapper({
  hosts: 'slickdeals.net',
  path: '/',
  params: ['u2'],
})
