import { isHostOf } from 'trousse'
import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Public archive replay hosts, numbered public3, public4 and so on.
const publicHostRegex = /^public\d+\.pagefreezer\.com$/

// The collection, then a dd-mm-yyyyTHH:MM capture time.
const publicPathRegex = /^\/(?:browse|content)\/[^/]+\/\d{2}-\d{2}-\d{4}T\d{2}:\d{2}\/(.+)$/i

// The web archive browser takes the archive id in the path and the target in `url`.
const browsePathRegex = /^\/en-US\/wa\/browse\/[0-9a-f-]{36}$/i

// PageFreezer public web archive snapshot (public<n>.pagefreezer.com/{browse,content}/<collection>/
// <capture time>/<target> and us.pagefreezer.com/en-US/wa/browse/<archive id>?url=<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapPagefreezer = createUnwrapper({
  subdomains: 'pagefreezer.com',
  unwrap: (url) => {
    if (isHostOf(url, publicHostRegex)) {
      const match = publicPathRegex.exec(url.pathname)

      if (!match?.[1]) {
        return
      }

      return addArchivedScheme(resolvePathTarget(url, match[1]))
    }

    if (isHostOf(url, 'us.pagefreezer.com') && browsePathRegex.test(url.pathname)) {
      return readParamTarget(url, 'url')
    }
  },
})
