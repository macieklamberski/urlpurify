import { createParamExtractor } from '../utils.js'

// Dyn email click tracker (link.email.dynect.net/link.php?DynEngagement=true&...&R=<target>, also
// on icm-tracking.meltwater.com). Not included in defaultUnwrappers: an email campaign click
// tracker, like unwrapMailchimp.
export const unwrapDyn = createParamExtractor({
  hosts: ['link.email.dynect.net', 'icm-tracking.meltwater.com'],
  path: '/link.php',
  params: ['R'],
})
