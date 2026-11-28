import { createQueryUnwrapper } from '../utils.js'

// Google Buzz share (www.google.com/buzz/post?url=<target>, never imageurl= or message=).
// Opt-in: unwrapping returns the shared page, not the form that posts it.
export const unwrapGoogleBuzz = createQueryUnwrapper({
  hosts: ['google.com', 'www.google.com'],
  path: '/buzz/post',
  params: ['url'],
  ignoreLinkFragment: true,
})
