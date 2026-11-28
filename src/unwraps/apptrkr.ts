import { createQueryUnwrapper } from '../utils.js'

// Apptrkr job-ad click tracker (apptrkr.com/get_redirect.php?id=<n>&targetURL=<target>).
// Opt-in: unwrapping drops the job board's click count for the ad.
export const unwrapApptrkr = createQueryUnwrapper({
  hosts: ['apptrkr.com', 'www.apptrkr.com'],
  path: '/get_redirect.php',
  params: ['targetURL'],
  // An Apptrkr link nested unencoded in `targetURL` spills its own `targetURL` into this query,
  // so the last one holds the target.
  index: -1,
})
