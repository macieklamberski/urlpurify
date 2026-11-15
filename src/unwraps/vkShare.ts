import { createParamExtractor } from '../utils.js'

// VK share (vk.com/share.php?url=<page>, also on VK's old domain vkontakte.ru). The title=,
// description=, image= and comment= beside it describe the post and never carry the page. Opt-in:
// unwrapping returns the shared page, not the form that shares it.
export const unwrapVkShare = createParamExtractor({
  hosts: ['vk.com', 'vkontakte.ru'],
  path: '/share.php',
  params: ['url'],
})
