import { createParamExtractor } from '../utils.js'

// WordPress.com email click tracker (public-api.wordpress.com/bar/?redirect_to=<target>).
// Not included in defaultUnwrappers: unwrapping removes the sender's click count.
// The host is matched exactly, as WordPress.com gives every blog a subdomain.
export const unwrapWordpressEmail = createParamExtractor({
  hosts: 'public-api.wordpress.com',
  path: '/bar/',
  params: ['redirect_to'],
})
