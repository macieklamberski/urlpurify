import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The Mint install folder, such as /stats/ or /mint/, then the Downloads pepper's script.
const pathRegex = /^\/[^/]+\/pepper\/orderedlist\/downloads\/download\.php$/

// Downloads pepper of the self-hosted Mint stats package, a download counter on each site's own
// host (<host>/<mint folder>/pepper/orderedlist/downloads/download.php?file=<target>). Opt-in:
// unwrapping drops the site's download count.
export const unwrapMintDownloads: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('file')

  if (target && isHttpUrl(target)) {
    return target
  }
}
