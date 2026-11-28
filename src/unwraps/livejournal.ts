import { createQueryUnwrapper } from '../utils.js'

// LiveJournal outbound link redirect (www.livejournal.com/away?to=<target>).
export const unwrapLivejournal = createQueryUnwrapper({
  hosts: ['livejournal.com', 'www.livejournal.com'],
  path: '/away',
  params: ['to'],
})
