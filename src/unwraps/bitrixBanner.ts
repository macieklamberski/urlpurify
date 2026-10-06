import type { UrlUnwrapper } from '../types.js'
import { getBitrixTarget } from './bitrix.js'

// 1C-Bitrix advertising module banner click on each site's own host
// (<host>/bitrix/rk.php?id=<banner>&event1=banner&event2=click&goto=<target>).
// Opt-in: unwrapping removes the site's banner click count, as other ad clicks.
export const unwrapBitrixBanner: UrlUnwrapper = (url) => {
  if (url.pathname !== '/bitrix/rk.php') {
    return
  }

  return getBitrixTarget(url)
}
