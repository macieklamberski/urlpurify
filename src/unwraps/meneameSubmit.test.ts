import { describe, expect, it } from 'bun:test'
import { unwrapMeneameSubmit } from './meneameSubmit.js'

describe('unwrapMeneameSubmit', () => {
  it('should extract the target from submit.php on www.meneame.net', () => {
    const value = new URL(
      'http://www.meneame.net/submit.php?url=http://www.example.com/noticias/economia/20130719/hundido-detroit-2412337.html',
    )
    const expected =
      'http://www.example.com/noticias/economia/20130719/hundido-detroit-2412337.html'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should extract the target from submit.php on meneame.net', () => {
    const value = new URL(
      'http://meneame.net/submit.php?url=http://blog.example.com/2011/09/08/visa-pour-limage-2011-unas-fotografias-y-la-ardua-tarea-de-seleccionar/',
    )
    const expected =
      'http://blog.example.com/2011/09/08/visa-pour-limage-2011-unas-fotografias-y-la-ardua-tarea-de-seleccionar/'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should extract the target from submit without an extension', () => {
    const value = new URL('https://www.meneame.net/submit?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should end the target where the url param ends', () => {
    const value = new URL(
      'http://meneame.net/submit.php?url=http://example.com/2015/03/potencia-factorial-numero.html&title=Un%20premio%20galactico',
    )
    const expected = 'http://example.com/2015/03/potencia-factorial-numero.html'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'https://www.meneame.net/submit.php?url=https%3A%2F%2Fexample.com%2F2012%2F07%2F20%2F%25c2%25a1si-que-hay-dinero%2F',
    )
    const expected = 'https://example.com/2012/07/20/%c2%a1si-que-hay-dinero/'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.meneame.net/submit.php?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.meneame.net/Submit.php?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapMeneameSubmit(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.meneame.net/submit.php?url=&title=Un%20premio')

    expect(unwrapMeneameSubmit(value)).toBeUndefined()
  })

  it('should return undefined for another path carrying url', () => {
    const value = new URL('https://www.meneame.net/story?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMeneameSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/submit.php?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapMeneameSubmit(value)).toBeUndefined()
  })
})
