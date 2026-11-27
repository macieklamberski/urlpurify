import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPathRegex = /^\/1\/l\/[0-9a-f]{32}$/i

const hosts = ['tx.bz-mail-us1.com', 'tx.bz-mail.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['rl'],
})

// BuzzStream outreach email click tracker (tx.bz-mail-us1.com/1/l/<32 hex>?rl=<target>, also
// tx.bz-mail.com).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapBuzzstream = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
