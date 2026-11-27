import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:redir\/clickGate\.php|api_v2\/ClickGate\.php)?$/i

const hosts = [
  'smartredirect.de',
  'www.smartredirect.de',
  'api.smartredirect.de',
  'b.xfreeservice.com',
]

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// smartredirect.de affiliate redirect (?url=<target> on /, /redir/clickGate.php and
// /api_v2/ClickGate.php), also on the b.xfreeservice.com click host.
export const unwrapSmartredirect = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
