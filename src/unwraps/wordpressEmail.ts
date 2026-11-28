import { createQueryUnwrapper } from '../utils.js'

// WordPress.com email click tracker (public-api.wordpress.com/bar/?redirect_to=<target>).
// Opt-in: unwrapping removes the sender's click count. The host is matched exactly, as
// WordPress.com gives every blog a subdomain.
export const unwrapWordpressEmail = createQueryUnwrapper({
  hosts: 'public-api.wordpress.com',
  path: '/bar/',
  params: ['redirect_to'],
})
