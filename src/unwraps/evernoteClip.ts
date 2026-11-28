import { createQueryUnwrapper } from '../utils.js'

// Evernote web clipper links (www.evernote.com/clip.action?url=<page>&title=…).
// Opt-in: unwrapping returns the clipped page, not the form that clips it. The `title=` and `body=`
// beside it are free text, even when they hold only a url.
export const unwrapEvernoteClip = createQueryUnwrapper({
  hosts: ['evernote.com', 'www.evernote.com'],
  path: '/clip.action',
  params: ['url'],
  ignoreLinkFragment: true,
})
