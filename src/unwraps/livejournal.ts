import { createQueryUnwrapper } from '../utils.js'

// LiveJournal outbound link redirect (www.livejournal.com/away?to=<target>).
export const unwrapLivejournal = createQueryUnwrapper({
  hosts: ['www.livejournal.com', 'livejournal.com'],
  path: '/away',
  params: ['to'],
})
