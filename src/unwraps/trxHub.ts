import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/(?:xid|syid)\/[^/]+$/i

// trx-hub commerce link tracker on publisher sites (clicks.trx-hub.com/xid/<publisher>?q=<target>,
// also /syid/<id>).
// Opt-in: unwrapping drops the publisher's commission. The target is often an affiliate link the
// publisher earns from.
export const unwrapTrxHub = createQueryUnwrapper({
  hosts: 'clicks.trx-hub.com',
  path: clickPathRegex,
  params: ['q'],
})
