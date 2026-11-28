import { createQueryUnwrapper } from '../utils.js'

// Promo Jukebox music-promotion newsletter click tracker
// (www.promojukebox.com/nwldel/link/?nlsendlistid=<n>&checkcode=<hex>&urlcc=<hex>&url=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapPromoJukebox = createQueryUnwrapper({
  hosts: ['promojukebox.com', 'www.promojukebox.com'],
  path: '/nwldel/link/',
  params: ['url'],
})
