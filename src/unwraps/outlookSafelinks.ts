import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/(?:ap\/[a-z]+-[0-9a-f]+\/)?$/

const extractTarget = createParamExtractor({
  hosts: /\.safelinks\.protection\.outlook\.com$/,
  params: ['url'],
})

// Outlook SafeLinks (<tenant>.safelinks.protection.outlook.com/?url=<target>, also
// /ap/<kind>-<id>/ for Teams and OneDrive links).
export const unwrapOutlookSafelinks: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
