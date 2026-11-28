import { createQueryUnwrapper } from '../utils.js'

// Tencent Qzone share form (sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<page>).
// Opt-in: unwrapping returns the shared page, not the form that shares it. The `title=` and
// `summary=` beside it are free text.
export const unwrapQzoneShare = createQueryUnwrapper({
  hosts: 'sns.qzone.qq.com',
  path: '/cgi-bin/qzshare/cgi_qzshare_onekey',
  params: ['url'],
  ignoreLinkFragment: true,
})
