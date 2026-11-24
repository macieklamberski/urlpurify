import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const linkPathRegex = /^\/(?:ap\/[a-z]+-[0-9a-f]+\/)?$/i

const extractTarget = createQueryUnwrapper({
  hosts:
    /(?:\.safelinks\.protection\.outlook\.com|^usg\d{2}\.safelinks\.protection\.office365\.us)$/,
  params: ['url'],
})

// Outlook on the web's own Safe Links page, which needs a signed-in mailbox
// (outlook.office.com/mail/safelink.html?url=<target>&corid=<id>).
const extractWebTarget = createQueryUnwrapper({
  hosts: 'outlook.office.com',
  path: '/mail/safelink.html',
  params: ['url'],
})

// Outlook SafeLinks (<tenant>.safelinks.protection.outlook.com/?url=<target>, also
// /ap/<kind>-<id>/ for Teams and OneDrive links), the US Government GCC High and DoD clouds on
// usg<nn>.safelinks.protection.office365.us, and Outlook on the web's page above.
export const unwrapOutlookSafelinks: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return extractWebTarget(url)
  }

  return extractTarget(url)
}
