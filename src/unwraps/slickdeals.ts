import { createQueryUnwrapper } from '../utils.js'

// Slickdeals outbound deal link (slickdeals.net/?sdtid=<id>&u2=<target>).
// Opt-in: unwrapping drops the publisher's commission. Slickdeals earns a commission on the
// outbound click.
export const unwrapSlickdeals = createQueryUnwrapper({
  hosts: ['slickdeals.net', 'www.slickdeals.net'],
  path: '/',
  params: ['u2'],
})
