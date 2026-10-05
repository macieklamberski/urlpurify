import { createParamExtractor } from '../utils.js'

// IRS leaving-site page (apps.irs.gov/app/scripts/exit.jsp?dest=<target>), also on www.irs.gov.
// The page names the target and links on to it.
export const unwrapIrs = createParamExtractor({
  hosts: ['apps.irs.gov', 'www.irs.gov'],
  path: '/app/scripts/exit.jsp',
  params: ['dest'],
})
