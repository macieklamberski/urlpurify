import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const paths = ['/click', '/e3ds/mail_link.php']

// Every subdomain of the two analytics domains runs the redirect, one per sender account.
const extractFromAnalyticsDomain = createQueryUnwrapper({
  domains: ['dmanalytics1.com', 'dmanalytics2.com'],
  params: ['u'],
})

const extractFromEthreemail = createQueryUnwrapper({
  hosts: 'ethreemail.com',
  params: ['u'],
})

// Direct Mail email click tracker (<account>.dmanalytics2.com/click?u=<target>, also
// dmanalytics1.com, and /e3ds/mail_link.php?u=<target> on those and ethreemail.com).
// Not included in defaultUnwrappers: an email click tracker, like Mailchimp.
export const unwrapDirectMail: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, paths)) {
    return
  }

  return extractFromAnalyticsDomain(url) ?? extractFromEthreemail(url)
}
