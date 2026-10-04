import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/(?:redir\/clickGate\.php|api_v2\/ClickGate\.php)?$/

const extractTarget = createParamExtractor({
  domains: 'smartredirect.de',
  params: ['url'],
})

// smartredirect.de affiliate redirect (?url=<target> on /, /redir/clickGate.php and
// /api_v2/ClickGate.php), on every subdomain.
export const unwrapSmartredirect: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
