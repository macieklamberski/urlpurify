import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const roverHostRegex = /^rover\.ebay\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const roverPathRegex = /^\/rover\/\d+\/[\d-]+\/\d+$/

const extractTarget = createParamExtractor({
  hosts: roverHostRegex,
  params: ['mpre', 'loc'],
})

// eBay Rover affiliate redirect (rover.ebay.<TLD>/rover/<n>/<campaign>/<n>?mpre=<target>, or the
// older ?loc=<target>).
export const unwrapEbayRover: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, roverHostRegex) || !roverPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
