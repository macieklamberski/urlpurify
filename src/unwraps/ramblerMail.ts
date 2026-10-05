import { createParamExtractor } from '../utils.js'

// Rambler Mail link redirect (mail.rambler.ru/m/redirect?url=<target>&hash=<signature>), also on
// email.rambler.ru.
export const unwrapRamblerMail = createParamExtractor({
  hosts: ['mail.rambler.ru', 'email.rambler.ru'],
  path: '/m/redirect',
  params: ['url'],
})
