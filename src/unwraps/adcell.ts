import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/(?:p\/click|click\.php|promotion\/click\/promoId\/\d+\/slotId\/\d+)$/i

// Adcell affiliate click (t.adcell.com/p/click?...&param0=<target>, with promoId and slotId or
// with encodingId, also /click.php, and
// www.adcell.de/promotion/click/promoId/<n>/slotId/<n>?param0=<target>, also /click.php).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAdcell = createQueryUnwrapper({
  hosts: ['t.adcell.com', 'www.adcell.de', 'adcell.de'],
  path: clickPathRegex,
  params: ['param0'],
})
