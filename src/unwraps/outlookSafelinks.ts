import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/(?:ap\/[a-z]+-[0-9a-f]+\/)?$/

const extractTarget = createParamExtractor({
  hosts:
    /(?:\.safelinks\.protection\.outlook\.com|^usg\d{2}\.safelinks\.protection\.office365\.us)$/,
  params: ['url'],
})

const extractWebTarget = createParamExtractor({
  hosts: 'outlook.office.com',
  path: '/mail/safelink.html',
  params: ['url'],
})

// Outlook SafeLinks (<tenant>.safelinks.protection.outlook.com/?url=<target>, also
// /ap/<kind>-<id>/ for Teams and OneDrive links), the US Government GCC High and DoD clouds on
// usg<nn>.safelinks.protection.office365.us, and Outlook on the web's own Safe Links page
// (outlook.office.com/mail/safelink.html?url=<target>&corid=<id>), which needs a signed-in mailbox.
export const unwrapOutlookSafelinks: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return extractWebTarget(url)
  }

  return extractTarget(url)
}
