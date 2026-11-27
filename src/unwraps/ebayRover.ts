import { createQueryUnwrapper } from '../utils.js'

const roverPathRegex = /^\/rover\/\d+\/[\d-]+\/\d+$/i

// eBay Rover affiliate redirect (rover.ebay.<TLD>/rover/<n>/<campaign>/<n>?mpre=<target>, or the
// older ?loc=<target>).
export const unwrapEbayRover = createQueryUnwrapper({
  hosts: /^rover\.ebay\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/,
  path: roverPathRegex,
  params: ['mpre', 'loc'],
})
