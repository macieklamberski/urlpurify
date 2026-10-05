import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/(?:redir\/clickGate\.php|api_v2\/ClickGate\.php)?$/

const extractTarget = createParamExtractor({
  hosts: ['smartredirect.de', 'www.smartredirect.de', 'api.smartredirect.de', 'b.xfreeservice.com'],
  params: ['url'],
})

// smartredirect.de affiliate redirect (?url=<target> on /, /redir/clickGate.php and
// /api_v2/ClickGate.php), also on the b.xfreeservice.com click host.
export const unwrapSmartredirect: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
