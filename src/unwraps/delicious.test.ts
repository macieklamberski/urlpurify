import { describe, expect, it } from 'bun:test'
import { unwrapDelicious } from './delicious.js'

describe('unwrapDelicious', () => {
  it('should extract a raw target from del.icio.us/post', () => {
    const value = new URL(
      'http://del.icio.us/post?url=https://www.example.com/4eme-edition-equi-meeting-mediation-15-et-16-septembre-2022-pompadour-19/&title=4%C3%A8me+%C3%A9di',
    )
    const expected =
      'https://www.example.com/4eme-edition-equi-meeting-mediation-15-et-16-septembre-2022-pompadour-19/'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from delicious.com/post', () => {
    const value = new URL(
      'http://delicious.com/post?url=http%3A%2F%2Fwww.example.com%2Fnwsrm%2Ftxtps%2F2016%2Ftfsk15-eng.html%3Frss&title=Do%20you%20owe%20income%20tax%3F%20Here%E2%80%',
    )
    const expected = 'http://www.example.com/nwsrm/txtps/2016/tfsk15-eng.html?rss'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should extract the target from delicious.com/save behind v, noui and jump', () => {
    const value = new URL(
      'http://delicious.com/save?v=5&noui&jump=close&url=http%3A%2F%2Fblog.example.net%2Fdebug_mode%2F221&title=%EA%B0%84%EB%8B%A4',
    )
    const expected = 'http://blog.example.net/debug_mode/221'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should extract the target from www.delicious.com/save', () => {
    const value = new URL(
      'http://www.delicious.com/save?v=5&noui&jump=close&url=http://www.example.com/fr/blog/534/vous-ne-devinerez-jamais-ce-que-jai-vu&title=Vous+ne+devinerez+jamais+ce+que+j%27ai+vu%21%21',
    )
    const expected = 'http://www.example.com/fr/blog/534/vous-ne-devinerez-jamais-ce-que-jai-vu'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should extract a target with only its scheme separator encoded', () => {
    const value = new URL(
      'http://del.icio.us/post?url=http%3A//example.com/node/222&title=Tan%C3%A1cs-Guly%C3%A1s%20N%C3%B3ra-%20FizioPont',
    )
    const expected = 'http://example.com/node/222'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL('http://del.icio.us/post?url=http%253A%252F%252Fexample.com%252Fpost')
    const expected = 'http://example.com/post'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://delicious.com/Save?url=http%3A%2F%2Fexample.com%2Fpost')
    const expected = 'http://example.com/post'

    expect(unwrapDelicious(value)).toBe(expected)
  })

  it('should never read the title param', () => {
    const value = new URL('http://del.icio.us/post?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDelicious(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://del.icio.us/post?url=&title=Title')

    expect(unwrapDelicious(value)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const value = new URL(
      'https://secure.del.icio.us/login?url=http%3A%2F%2Fexample.com%2Fpost&title=Title',
    )

    expect(unwrapDelicious(value)).toBeUndefined()
  })

  it('should return undefined for a user page', () => {
    const value = new URL('http://del.icio.us/edtechtalk?jump=no&url=http%3A%2F%2Fexample.com%2F')

    expect(unwrapDelicious(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://www.example.com/save?url=http%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapDelicious(value)).toBeUndefined()
  })
})
