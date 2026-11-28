import { isHostOf } from 'trousse'
import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// The collection, then a dd-mm-yyyyTHH:MM capture time.
const publicPathRegex =
  /^\/(?:browse|content)\/[^/]+\/\d{2}-\d{2}-\d{4}T\d{2}:\d{2}\/(?<target>.+)$/i

// The web archive browser takes the archive id in the path and the target in `url`.
const browsePathRegex = /^\/en-US\/wa\/browse\/[0-9a-f-]{36}$/i

// PageFreezer public web archive snapshot (public<n>.pagefreezer.com/{browse,content}/<collection>/
// <capture time>/<target> and us.pagefreezer.com/en-US/wa/browse/<archive id>?url=<target>).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapPagefreezer = createUnwrapper({
  subdomains: 'pagefreezer.com',
  match: /^(?:public\d+|us)\.pagefreezer\.com$/,
  unwrap: (url) => {
    if (isHostOf(url, 'us.pagefreezer.com')) {
      if (!browsePathRegex.test(url.pathname)) {
        return
      }

      return readParamTarget(url, 'url')
    }

    const match = publicPathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return addArchivedScheme(resolvePathTarget(url, match.groups.target))
  },
})
