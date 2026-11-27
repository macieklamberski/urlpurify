import { isBrandDomainOf, isHostOrSubdomainOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment } from '../utils.js'

// The free domains a site may also live on, beside the brand's own domains.
const domains = ['3dn.ru', 'at.ua', 'clan.su', 'do.am', 'moy.su', 'my1.ru', 'narod.ru', 'usite.pro']

const gluedHostRegex = /^\/(?=\/(?:[a-z0-9-]+\.)+[a-z]{2,}\/)/i

// uCoz site with a protocol-relative src glued onto its own host as text (<site>//<host>/<path>),
// which uCoz answers with a 404.
export const unwrapUcoz: UrlUnwrapper = (url) => {
  if (!isBrandDomainOf(url, 'ucoz') && !isHostOrSubdomainOf(url, domains)) {
    return
  }

  const target = getPathTarget(url, gluedHostRegex)

  if (!target) {
    return
  }

  return appendLinkFragment(target, url)
}
