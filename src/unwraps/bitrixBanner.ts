import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// 1C-Bitrix advertising module banner click on each site's own host
// (<host>/bitrix/rk.php?id=<banner>&event1=banner&event2=click&goto=<target>).
// Opt-in: unwrapping removes the site's banner click count, as other ad clicks.
export const unwrapBitrixBanner: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/bitrix/rk.php')) {
      return
    }

    return readParamTarget(url, 'goto')
  },
})
