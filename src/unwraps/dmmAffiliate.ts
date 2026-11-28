import { createQueryUnwrapper } from '../utils.js'

// DMM and FANZA affiliate link (al.dmm.co.jp, al.dmm.com and al.fanza.co.jp, /?lurl=<target>).
// Opt-in: unwrapping drops the publisher's affiliate commission.
export const unwrapDmmAffiliate = createQueryUnwrapper({
  hosts: ['al.dmm.co.jp', 'al.dmm.com', 'al.fanza.co.jp'],
  path: '/',
  params: ['lurl'],
})
