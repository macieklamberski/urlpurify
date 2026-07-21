import { createParamExtractor } from '../utils.js'

// Naver outbound link redirect (cc.loginfra.com/...?u=<target>). Naver is a major Korean
// platform; the redirect only tracks the click.
export const unwrapNaverOutgoing = createParamExtractor({
  hosts: 'cc.loginfra.com',
  params: ['u'],
})
