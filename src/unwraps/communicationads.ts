import { createQueryUnwrapper } from '../utils.js'

// communicationAds affiliate click (www.communicationads.net/tc.php?t=<campaign id>&
// deeplink=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapCommunicationads = createQueryUnwrapper({
  hosts: ['communicationads.net', 'www.communicationads.net'],
  path: '/tc.php',
  params: ['deeplink'],
})
