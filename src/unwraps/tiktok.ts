import { createParamExtractor } from '../utils.js'

// TikTok outbound link shim for profile bio links (www.tiktok.com/link/v2?target=<target>).
export const unwrapTiktok = createParamExtractor({
  hosts: 'www.tiktok.com',
  path: '/link/v2',
  params: ['target'],
})
