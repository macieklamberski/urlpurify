import { createPathUnwrapper } from '../pathTarget.js'

// PBS resolves a target without a scheme as a path on www.pbs.org.
const redirPrefixRegex = /^\/(?:[\w-]+\/)+redir\/(?=https?:\/)/i

// PBS download and click counter (www.pbs.org/<show path>/redir/<target>), such as
// /wgbh/nova/rss/podcast/redir/ on podcast enclosures. The target keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes PBS's download counts.
export const unwrapPbs = createPathUnwrapper({
  hosts: 'www.pbs.org',
  prefix: redirPrefixRegex,
})
