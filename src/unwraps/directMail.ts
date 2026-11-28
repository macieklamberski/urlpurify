import { isAnyOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const paths = ['/click', '/e3ds/mail_link.php']

// Every subdomain of the two analytics domains runs the redirect, one per sender account.
const extractFromAnalyticsDomain = createQueryUnwrapper({
  domains: ['dmanalytics1.com', 'dmanalytics2.com'],
  params: ['u'],
})

const extractFromEthreemail = createQueryUnwrapper({
  hosts: ['ethreemail.com', 'www.ethreemail.com'],
  params: ['u'],
})

// Direct Mail email click tracker (<account>.dmanalytics2.com/click?u=<target>, also
// dmanalytics1.com, and /e3ds/mail_link.php?u=<target> on those and ethreemail.com).
// Opt-in: an email click tracker, like Mailchimp.
export const unwrapDirectMail = createUnwrapper({
  domains: ['dmanalytics1.com', 'dmanalytics2.com', 'ethreemail.com'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    return extractFromAnalyticsDomain(url) ?? extractFromEthreemail(url)
  },
})
