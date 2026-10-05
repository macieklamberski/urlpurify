import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:p\/click|click\.php|promotion\/click\/promoId\/\d+\/slotId\/\d+)$/

const extractTarget = createParamExtractor({
  hosts: ['t.adcell.com', 'www.adcell.de'],
  params: ['param0'],
})

// Adcell affiliate click (t.adcell.com/p/click?promoId=<n>&slotId=<n>&param0=<target>, also
// /click.php, and www.adcell.de/promotion/click/promoId/<n>/slotId/<n>?param0=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAdcell: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
