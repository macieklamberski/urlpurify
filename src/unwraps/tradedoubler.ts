import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Tradedoubler affiliate redirect (clk.tradedoubler.com/click?url=<target>, also
// ?url=&url=<target>).
export const unwrapTradedoubler: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'clk.tradedoubler.com') || url.pathname !== '/click') {
    return
  }

  return url.searchParams.getAll('url').find((value) => value)
}
