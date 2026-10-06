import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const gotoPrefixRegex = /^\/goto\//

// Rojadirecta leaving-site page (www.rojadirecta.me/goto/<target>), where the target drops its
// scheme. Law enforcement seized the domain, and captures up to 2021 show the page linking on
// to the target.
export const unwrapRojadirecta: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.rojadirecta.me')) {
    return
  }

  return getPathTarget(url, gotoPrefixRegex)
}
