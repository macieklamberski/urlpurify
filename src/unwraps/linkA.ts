import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const productLinkPathRegex = /^\/click_product_link\/[0-9a-f]+\/[0-9a-f]+\/?$/i

const extractGateTarget = createQueryUnwrapper({
  hosts: ['link-a.net', 'www.link-a.net'],
  path: '/gate.php',
  params: ['mallurl1'],
})

const extractProductLinkTarget = createQueryUnwrapper({
  hosts: 'cl.link-ag.net',
  params: ['redirect_url'],
})

// Link-A affiliate click (link-a.net/gate.php?...&mallurl1=<target>, and
// cl.link-ag.net/click_product_link/<id>/<id>?redirect_url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLinkA = createUnwrapper({
  hosts: ['link-a.net', 'www.link-a.net', 'cl.link-ag.net'],
  unwrap: (url) => {
    if (productLinkPathRegex.test(url.pathname)) {
      return extractProductLinkTarget(url)
    }

    return extractGateTarget(url)
  },
})
