import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Feeder pepper of the self-hosted Mint stats package, which counts clicks from a site's feed on
// its own host (<host>/feeder/?FeederAction=clicked&feed=<name>&seed=<target>). The exact path, the
// clicked action and an http `seed` are the guard. Captures from 2008 show it forwarding.
// Not included in defaultUnwrappers: unwrapping drops the site's feed click count.
export const unwrapMintFeeder: UrlUnwrapper = (url) => {
  if (url.pathname !== '/feeder/' || url.searchParams.get('FeederAction') !== 'clicked') {
    return
  }

  const target = url.searchParams.get('seed')

  if (target && isHttpUrl(target)) {
    return target
  }
}
