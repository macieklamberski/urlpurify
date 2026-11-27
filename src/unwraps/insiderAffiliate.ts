import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractAffiliate = createQueryUnwrapper({
  hosts: 'affiliate.insider.com',
  path: '/',
  params: ['u'],
})

const extractReviewsOut = createQueryUnwrapper({
  hosts: ['www.businessinsider.com', 'www.insider.com'],
  path: '/reviews/out',
  params: ['u'],
})

// Insider commerce redirect (affiliate.insider.com/?h=<hash>&postID=<id>&u=<target>), and the
// older one on its own sites (www.businessinsider.com/reviews/out?type=<kind>&u=<target>, also
// www.insider.com). Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate
// commission.
export const unwrapInsiderAffiliate = createUnwrapper({
  hosts: ['affiliate.insider.com', 'www.businessinsider.com', 'www.insider.com'],
  unwrap: (url) => {
    return extractAffiliate(url) ?? extractReviewsOut(url)
  },
})
