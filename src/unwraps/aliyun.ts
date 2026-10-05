import { createParamExtractor } from '../utils.js'

// Alibaba Cloud developer community outbound link redirect
// (yq.aliyun.com/go/articleRenderRedirect?url=<target>).
export const unwrapAliyun = createParamExtractor({
  hosts: 'yq.aliyun.com',
  path: '/go/articleRenderRedirect',
  params: ['url'],
})
