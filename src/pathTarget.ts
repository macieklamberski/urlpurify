const leadingSlashesRegex = /^\/+/
const schemeRegex = /^https?:/i

// The target that follows a prefix at the start of the path, with the url's own query and
// fragment. Podcast analytics prefixes mostly drop the target's scheme, which then follows the
// prefix's own, so an http prefix hands on an http url. A wrapper known to forward to one scheme
// passes it.
export const getPathTarget = (
  url: URL,
  prefixRegex: RegExp,
  scheme = url.protocol,
): string | undefined => {
  const match = url.pathname.match(prefixRegex)

  if (!match) {
    return
  }

  // Some feeds leave an empty segment after the prefix, as in `redirect.mp3//<target>`.
  const path = url.pathname.slice(match[0].length).replace(leadingSlashesRegex, '')

  if (!path) {
    return
  }

  const target = `${path}${url.search}${url.hash}`

  if (schemeRegex.test(target)) {
    return target
  }

  return `${scheme}//${target}`
}
