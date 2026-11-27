import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const roverHostRegex = /^rover\.ebay\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const roverPathRegex = /^\/rover\/\d+\/[\d-]+\/\d+$/i

const extractTarget = createQueryUnwrapper({
  hosts: roverHostRegex,
  params: ['mpre', 'loc'],
})

// eBay Rover affiliate redirect (rover.ebay.<TLD>/rover/<n>/<campaign>/<n>?mpre=<target>, or the
// older ?loc=<target>).
export const unwrapEbayRover: UrlUnwrapper = (url) => {
  if (!isHostOf(url, roverHostRegex) || !roverPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
