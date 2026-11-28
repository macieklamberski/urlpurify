import { isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// The Mint install folder, such as /stats/ or /mint/, then the Downloads pepper's script.
const pathRegex = /^\/[^/]+\/pepper\/orderedlist\/downloads\/download\.php$/i

// Downloads pepper of the self-hosted Mint stats package, a download counter on each site's own
// host (<host>/<mint folder>/pepper/orderedlist/downloads/download.php?file=<target>).
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapMintDownloads = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'file')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
