import { isHostOrSubdomainOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const domains = [
  '3dn.ru',
  'at.ua',
  'clan.su',
  'do.am',
  'moy.su',
  'my1.ru',
  'narod.ru',
  'ucoz.ae',
  'ucoz.club',
  'ucoz.com',
  'ucoz.com.br',
  'ucoz.de',
  'ucoz.es',
  'ucoz.hu',
  'ucoz.kz',
  'ucoz.lv',
  'ucoz.net',
  'ucoz.org',
  'ucoz.pl',
  'ucoz.ru',
  'ucoz.site',
  'ucoz.ua',
  'usite.pro',
]

const gluedHostRegex = /^\/(?=\/(?:[a-z0-9-]+\.)+[a-z]{2,}\/)/i

// uCoz site with a protocol-relative src glued onto its own host as text (<site>//<host>/<path>),
// which uCoz answers with a 404.
export const unwrapUcoz: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, domains)) {
    return
  }

  return getPathTarget(url, gluedHostRegex)
}
