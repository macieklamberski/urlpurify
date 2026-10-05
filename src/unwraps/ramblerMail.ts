import { createParamExtractor } from '../utils.js'

// Rambler Mail link redirect (mail.rambler.ru/m/redirect?url=<target>&hash=<signature>).
export const unwrapRamblerMail = createParamExtractor({
  hosts: 'mail.rambler.ru',
  path: '/m/redirect',
  params: ['url'],
})
