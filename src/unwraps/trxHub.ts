import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPathRegex = /^\/(?:xid|syid)\/[^/]+$/i

const hosts = ['clicks.trx-hub.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['q'],
})

// trx-hub commerce link tracker on publisher sites (clicks.trx-hub.com/xid/<publisher>?q=<target>,
// also /syid/<id>). Opt-in: the target is often an affiliate link the publisher earns from.
export const unwrapTrxHub = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
