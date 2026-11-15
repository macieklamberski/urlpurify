import { describe, expect, it } from 'bun:test'
import { unwrapGoogleBuzz } from './googleBuzz.js'

describe('unwrapGoogleBuzz', () => {
  it('should extract a raw target', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?url=http://example.com/2010/09/why-orange/&imageurl=',
    )
    const expected = 'http://example.com/2010/09/why-orange/'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?url=https%3A%2F%2Fexample.com%2Fjm%2F2026%2F04%2F27%2Fopen-call-for-papers-organic-photodetectors%2F',
    )
    const expected =
      'https://example.com/jm/2026/04/27/open-call-for-papers-organic-photodetectors/'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should extract a target with only its colon encoded', () => {
    const value = new URL('http://www.google.com/buzz/post?url=http%3A//example.com/node/59')
    const expected = 'http://example.com/node/59'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should read url over the message', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?url=http%3A%2F%2Fwww.example.com%2F2011%2F09%2Fabaixo-a-corrupcao-da-midia%2F&message=Abaixo%20a%20corrup%C3%A7%C3%A3o%20da%20m%C3%ADdia',
    )
    const expected = 'http://www.example.com/2011/09/abaixo-a-corrupcao-da-midia/'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should extract the target after an empty leading param', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?&url=http://www.example.com/diario/suplementos/soy/1-2172-2011-10-31.html',
    )
    const expected = 'http://www.example.com/diario/suplementos/soy/1-2172-2011-10-31.html'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://www.google.com/Buzz/Post?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapGoogleBuzz(value)).toBe(expected)
  })

  it('should return undefined for a link carrying only an image and a message', () => {
    const value = new URL(
      'http://www.google.com/buzz/post?imageurl=https%3A%2F%2Fexample.com%2Fphoto.jpg&message=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapGoogleBuzz(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://www.google.com/buzz/post?url=&imageurl=')

    expect(unwrapGoogleBuzz(value)).toBeUndefined()
  })

  it('should return undefined for another Buzz path', () => {
    const value = new URL('http://www.google.com/buzz/example?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapGoogleBuzz(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://www.example.com/buzz/post?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapGoogleBuzz(value)).toBeUndefined()
  })
})
