import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/(?:ap\/[a-z]+-[0-9a-f]+\/)?$/

const extractTarget = createParamExtractor({
  hosts:
    /(?:\.safelinks\.protection\.outlook\.com|^usg\d{2}\.safelinks\.protection\.office365\.us)$/,
  params: ['url'],
})

// Outlook SafeLinks (<tenant>.safelinks.protection.outlook.com/?url=<target>, also
// /ap/<kind>-<id>/ for Teams and OneDrive links), and the US Government GCC High cloud on
// usg<nn>.safelinks.protection.office365.us.
export const unwrapOutlookSafelinks: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
