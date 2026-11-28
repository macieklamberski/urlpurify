import { describe, expect, it } from 'bun:test'
import { unwrapLocaweb } from './locaweb.js'

const unclaimedIds: Array<string> = [
  '12345',
  'XH%7C871925%7C266422%7C21109',
  'H%7C871925%7C266422%7C21109%7C1',
  'H%7Cabc%7C266422%7C21109',
]

describe('unwrapLocaweb', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'http://sinait.example.net/registra_clique.php?id=H%7C871925%7C266422%7C21109&url=https%3A%2F%2Fwww.example.org%2Fdocs%2Fpdc-791_17.pdf',
    )
    const expected = 'https://www.example.org/docs/pdc-791_17.pdf'

    expect(unwrapLocaweb(value)).toBe(expected)
  })

  it('should extract target with an unencoded id', () => {
    const value = new URL(
      'http://grupocasa.example.com.br/registra_clique.php?id=H|838452|248135|58093&url=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapLocaweb(value)).toBe(expected)
  })

  it('should extract target from a test send', () => {
    const value = new URL(
      'http://blog.example.net/registra_clique.php?id=TH|teste|139443|7101&url=http%3A%2F%2Fwww.example.org%2Finformativos%2F',
    )
    const expected = 'http://www.example.org/informativos/'

    expect(unwrapLocaweb(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'http://newsletter.example.com.br/registra_clique.php?id=H%7c23882319%7c281061%7c123&url=http://www.example.com/bahia/2014/',
    )
    const expected = 'http://www.example.com/bahia/2014/'

    expect(unwrapLocaweb(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://newsletter.example.com.br/registra_clique.php?id=H%7C23882319%7C281061%7C123&url=https://www.example.com/search/a+b',
    )
    const expected = 'https://www.example.com/search/a+b'

    expect(unwrapLocaweb(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL(
      'http://sinait.example.net/registra_clique.php?id=H%7C871925%7C266422%7C21109',
    )

    expect(unwrapLocaweb(value)).toBeUndefined()
  })

  it('should return undefined without id', () => {
    const value = new URL(
      'http://sinait.example.net/registra_clique.php?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLocaweb(value)).toBeUndefined()
  })

  it.each(unclaimedIds)('should return undefined for id %s', (id) => {
    const value = new URL(
      `http://sinait.example.net/registra_clique.php?id=${id}&url=https%3A%2F%2Fwww.example.org%2F`,
    )

    expect(unwrapLocaweb(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://sinait.example.net/ver_mensagem.php?id=H%7C871925%7C266422%7C21109&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLocaweb(value)).toBeUndefined()
  })
})
