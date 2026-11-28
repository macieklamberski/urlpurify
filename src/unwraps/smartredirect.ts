import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:redir\/clickGate\.php|api_v2\/ClickGate\.php)?$/i

// smartredirect.de affiliate redirect (?url=<target> on /, /redir/clickGate.php and
// /api_v2/ClickGate.php), also on the b.xfreeservice.com click host.
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapSmartredirect = createQueryUnwrapper({
  hosts: ['smartredirect.de', 'www.smartredirect.de', 'api.smartredirect.de', 'b.xfreeservice.com'],
  path: pathRegex,
  params: ['url'],
})
