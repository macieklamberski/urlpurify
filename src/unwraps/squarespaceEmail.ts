import { createParamExtractor } from '../utils.js'

// Squarespace Email Campaigns click tracker (engage.squarespace-mail.com/r?u=<target>, also on
// four-character subdomains such as f69e.engage and on mgcp01.engage to mgcp03.engage).
// Not included in defaultUnwrappers: an email campaign click tracker, like unwrapMailchimp.
export const unwrapSquarespaceEmail = createParamExtractor({
  hosts: /^(?:[a-z0-9]{4}\.|mgcp\d{2}\.)?engage\.squarespace-mail\.com$/,
  path: '/r',
  params: ['u'],
})
