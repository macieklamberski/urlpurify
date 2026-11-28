import { createQueryUnwrapper } from '../utils.js'

// Intranet Quorum constituent email click tracker
// (outreach.senate.gov/iqextranet/iqClickTrk.aspx?cid=<office>&redirect=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapIntranetQuorum = createQueryUnwrapper({
  hosts: ['iqconnect.house.gov', 'iqconnect.lmhostediq.com', 'outreach.senate.gov'],
  path: '/iqextranet/iqClickTrk.aspx',
  params: ['redirect'],
})
