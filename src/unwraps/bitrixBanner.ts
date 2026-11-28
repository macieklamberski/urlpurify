import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// 1C-Bitrix advertising module banner click on each site's own host
// (<host>/bitrix/rk.php?id=<banner>&event1=banner&event2=click&goto=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapBitrixBanner = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/bitrix/rk.php')) {
      return
    }

    return readParamTarget(url, 'goto')
  },
})
