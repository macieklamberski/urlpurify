import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const linkPathRegex = /^\/(?:ap\/[a-z]+-[0-9a-f]+\/)?$/i

const safelinksHostRegex =
  /(?:\.safelinks\.protection\.outlook\.com|^usg\d{2}\.safelinks\.protection\.office365\.us)$/

const extractTarget = createQueryUnwrapper({
  hosts: safelinksHostRegex,
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
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapOutlookSafelinks = createUnwrapper({
  hosts: [safelinksHostRegex, 'outlook.office.com'],
  unwrap: (url) => {
    if (!linkPathRegex.test(url.pathname)) {
      return extractWebTarget(url)
    }

    return extractTarget(url)
  },
})
