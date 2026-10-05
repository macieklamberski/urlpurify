import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/click', '/e3ds/mail_link.php']

// Every subdomain of the two analytics domains runs the redirect, one per sender account.
const extractFromAnalyticsDomain = createParamExtractor({
  domains: ['dmanalytics1.com', 'dmanalytics2.com'],
  params: ['u'],
})

const extractFromEthreemail = createParamExtractor({
  hosts: 'ethreemail.com',
  params: ['u'],
})

// Direct Mail email click tracker (<account>.dmanalytics2.com/click?u=<target>, also
// dmanalytics1.com, and /e3ds/mail_link.php?u=<target> on those and ethreemail.com).
// Not included in defaultUnwrappers: an email click tracker, like Mailchimp.
export const unwrapDirectMail: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractFromAnalyticsDomain(url) ?? extractFromEthreemail(url)
}
