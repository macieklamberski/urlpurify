import { createParamExtractor } from '../utils.js'

// LiveJournal outbound link redirect (www.livejournal.com/away?to=<target>).
export const unwrapLivejournal = createParamExtractor({
  hosts: 'www.livejournal.com',
  path: '/away',
  params: ['to'],
})
