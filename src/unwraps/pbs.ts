import { createPathUnwrapper } from '../pathTarget.js'

// PBS resolves a target without a scheme as a path on www.pbs.org.
const redirPrefixRegex = /^\/(?:[\w-]+\/)+redir\/(?=https?(?::|%(?:25)?3a))/i

// PBS download and click counter (www.pbs.org/<show path>/redir/<target>), such as
// /wgbh/nova/rss/podcast/redir/ on podcast enclosures. The target keeps its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPbs = createPathUnwrapper({
  hosts: ['pbs.org', 'www.pbs.org'],
  prefix: redirPrefixRegex,
})
