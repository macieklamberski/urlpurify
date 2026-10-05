import { createParamExtractor } from '../utils.js'

// communicationAds affiliate click (www.communicationads.net/tc.php?t=<campaign id>&
// deeplink=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapCommunicationads = createParamExtractor({
  hosts: 'www.communicationads.net',
  path: '/tc.php',
  params: ['deeplink'],
})
