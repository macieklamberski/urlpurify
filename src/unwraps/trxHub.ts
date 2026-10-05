import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:xid|syid)\/[^/]+$/

const extractTarget = createParamExtractor({
  hosts: 'clicks.trx-hub.com',
  params: ['q'],
})

// trx-hub commerce link tracker on publisher sites (clicks.trx-hub.com/xid/<publisher>?q=<target>,
// also /syid/<id>). Opt-in: the target is often an affiliate link the publisher earns from.
export const unwrapTrxHub: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
