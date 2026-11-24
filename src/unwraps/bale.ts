import { createQueryUnwrapper } from '../utils.js'

// Bale messenger outbound link redirect (l.ble.ir/?l=<target>&spec=<sender ids>).
export const unwrapBale = createQueryUnwrapper({
  hosts: 'l.ble.ir',
  path: '/',
  params: ['l'],
})
