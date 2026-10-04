import { createParamExtractor } from '../utils.js'

// WordPress.com outbound link tracker (go2.wordpress.com/?id=<id>&url=<target>). Not included in
// defaultUnwrappers: the id looks like an affiliate publisher id, so unwrapping drops it.
// Exact host, since WordPress.com hands out subdomains to third parties.
export const unwrapWordpressGo2 = createParamExtractor({
  hosts: 'go2.wordpress.com',
  path: '/',
  params: ['url'],
})
