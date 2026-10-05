import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The install directory, such as /horde/ or /hwebmail/, or none. Horde 3 serves util/go.php too.
const pathRegex = /^(?:\/[a-z0-9]+)?\/(?:services|util)\/go\.php$/

// Horde webmail link dereferrer on any host (<mail host>/horde/services/go.php?url=<target>).
// Each mail provider or university runs Horde on its own host.
export const unwrapHorde: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
