import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// 1C-Bitrix statistics module outbound link counter on each site's own host
// (<host>/bitrix/redirect.php?event1=&event2=&event3=&goto=<target>).
export const unwrapBitrix: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, '/bitrix/redirect.php')) {
    return
  }

  return getParamTarget(url, 'goto')
}
