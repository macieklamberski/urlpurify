import { isAnyOf, parseUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamValues, readParamTarget } from '../utils.js'

const hosts = ['www.xing.com', 'xing.com']

const sharePathRegex =
  /^\/(?:spi\/shares\/new|social_plugins\/share(?:\/new)?|social\/share\/spi)\/?$/i
const appPathRegex = /^\/app\/user\/?$/i

// XING share (xing.com/spi/shares/new?url=<target>, /social_plugins/share/new,
// /social_plugins/share and /social/share/spi, and the legacy /app/user?op=share&url=, on www. and
// bare xing.com). Opt-in: unwrapping returns the shared page, not the share form.
export const unwrapXingShare: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, sharePathRegex)) {
      return readParamTarget(url, 'url')
    }

    if (!isAnyOf(url.pathname, appPathRegex)) {
      return
    }

    // The legacy app link separates its params with `;` as well as `&`, as XING reads it, and
    // serves other actions than a share on `op=`.
    const query = parseUrl(url.href.replace(url.search, () => url.search.replaceAll(';', '&')))

    if (!query || getParamValues(query, 'op').at(0) !== 'share') {
      return
    }

    return readParamTarget(query, 'url')
  },
})
