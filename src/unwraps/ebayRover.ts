import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const roverHostRegex = /^rover\.ebay\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const roverPathRegex = /^\/rover\/\d+\/[\d-]+\/\d+$/

const extractMpre = createParamExtractor({
  hosts: roverHostRegex,
  params: ['mpre'],
})

// eBay Rover affiliate redirect (rover.ebay.<TLD>/rover/<n>/<campaign>/<n>?mpre=<target>).
export const unwrapEbayRover: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, roverHostRegex) || !roverPathRegex.test(url.pathname)) {
    return
  }

  return extractMpre(url)
}
