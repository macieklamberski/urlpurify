import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Public archive replay hosts, numbered public3, public4 and so on.
const publicHostRegex = /^public\d+\.pagefreezer\.com$/

// The collection, then a dd-mm-yyyyTHH:MM capture time.
const publicPathRegex = /^\/(?:browse|content)\/[^/]+\/\d{2}-\d{2}-\d{4}T\d{2}:\d{2}\/(.+)$/

// The web archive browser takes the archive id in the path and the target in `url`.
const browsePathRegex = /^\/en-US\/wa\/browse\/[0-9a-f-]{36}$/

// PageFreezer public web archive snapshot (public<n>.pagefreezer.com/{browse,content}/<collection>/
// <capture time>/<target> and us.pagefreezer.com/en-US/wa/browse/<archive id>?url=<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapPagefreezer: UrlUnwrapper = (url) => {
  if (publicHostRegex.test(url.hostname)) {
    const match = publicPathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
    const target = `${match[1]}${url.search}${url.hash}`

    if (isHttpUrl(target)) {
      return target
    }

    return
  }

  if (isHostOf(url, 'us.pagefreezer.com') && browsePathRegex.test(url.pathname)) {
    return url.searchParams.get('url') ?? undefined
  }
}
