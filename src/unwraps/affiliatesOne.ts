import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/track\/clicks\/\d+\/c627c2b[0-9a-f]+$/

const extractTarget = createParamExtractor({
  hosts: [
    'abzcoupon.com',
    'affckr.site',
    'affclk.site',
    'affclkr.com',
    'affclkr.online',
    'afflnk.site',
    'affone.site',
    'affsrc.com',
    'afftck.com',
    'afftck.site',
    'afftkr.site',
    'aftck.com',
    'tlcafftrax.com',
    'track.abzcoupon.com',
    'track.affclkr.com',
    'track.affsrc.com',
    'track.afftck.com',
    'track.tlcafftrax.com',
    'track.twcouponcenter.com',
    'track.twshop4coupon.com',
    'track.vbshoptrax.com',
    'twcouponcenter.com',
    'twshop4coupon.com',
    'vbshoptrax.com',
    'vbtrax.com',
  ],
  params: ['t'],
})

// Affiliates One affiliate click (<click host>/track/clicks/<campaign id>/c627c2b<hex>?t=<target>),
// on the network's click domains. Not included in defaultUnwrappers: unwrapping drops the
// publisher's commission.
export const unwrapAffiliatesOne: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
