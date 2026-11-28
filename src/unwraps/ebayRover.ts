import { createQueryUnwrapper } from '../utils.js'

const roverPathRegex = /^\/rover\/\d+\/[\d-]+\/\d+$/i

// eBay Rover affiliate redirect (rover.ebay.<TLD>/rover/<n>/<campaign>/<n>?mpre=<target>, or the
// older ?loc=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapEbayRover = createQueryUnwrapper({
  brands: 'ebay',
  match: /^rover\.ebay\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/,
  path: roverPathRegex,
  params: ['mpre', 'loc'],
})
