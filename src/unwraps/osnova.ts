import { createParamExtractor } from '../utils.js'

// Osnova, the platform behind vc.ru and dtf.ru, outbound link redirect
// (api.vc.ru/v2.8/redirect?to=<target>&postId=<id>).
export const unwrapOsnova = createParamExtractor({
  hosts: ['api.dtf.ru', 'api.vc.ru'],
  path: '/v2.8/redirect',
  params: ['to'],
})
