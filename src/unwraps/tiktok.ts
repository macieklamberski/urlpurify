import { createQueryUnwrapper } from '../utils.js'

// TikTok outbound link shim for profile bio links (www.tiktok.com/link/v2?target=<target>).
export const unwrapTiktok = createQueryUnwrapper({
  hosts: ['tiktok.com', 'www.tiktok.com'],
  path: '/link/v2',
  params: ['target'],
})
