import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// 1C-Bitrix statistics module outbound link counter on each site's own host
// (<host>/bitrix/redirect.php?event1=&event2=&event3=&goto=<target>).
export const unwrapBitrix: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/bitrix/redirect.php')) {
      return
    }

    return readParamTarget(url, 'goto')
  },
})
