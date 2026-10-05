import { describe, expect, it } from 'bun:test'
import { unwrapLinkA } from './linkA.js'

describe('unwrapLinkA', () => {
  it('should extract target from mallurl1 param', () => {
    const url = new URL(
      'https://link-a.net/gate.php?guid=on&mcode=mabznebw&acode=vpxjj7mbwlts&itemid=0&mallurl1=https%3A%2F%2Fwww.example.com%2Fbook_title%2FBSD0000090336',
    )

    expect(unwrapLinkA(url)).toBe('https://www.example.com/book_title/BSD0000090336')
  })

  it('should extract target from redirect_url param', () => {
    const url = new URL(
      'https://cl.link-ag.net/click_product_link/b6239d/fa5bcb60?redirect_url=https%3A%2F%2Fwww.example.com%2Fvod%2Fdetail%2F%3Fseason%3Dnqs9phiw5v9f',
    )

    expect(unwrapLinkA(url)).toBe('https://www.example.com/vod/detail/?season=nqs9phiw5v9f')
  })

  it('should extract target from redirect_url param with a trailing slash on the path', () => {
    const url = new URL(
      'https://cl.link-ag.net/click_product_link/196651/0055575a/?redirect_url=https%3A%2F%2Fwww.example.com%2Fbooks%2F606591%2F',
    )

    expect(unwrapLinkA(url)).toBe('https://www.example.com/books/606591/')
  })

  it('should return undefined when mallurl1 param is missing', () => {
    const url = new URL('https://link-a.net/gate.php?guid=on&mcode=mabznebw&acode=vpxjj7mbwlts')

    expect(unwrapLinkA(url)).toBeUndefined()
  })

  it('should return undefined for the impression image', () => {
    const url = new URL(
      'https://imps.link-ag.net/imp_product_link/3d6618/05dfbb17?banner_url=https://example.com/a.jpg',
    )

    expect(unwrapLinkA(url)).toBeUndefined()
  })

  it('should return undefined for another path on cl.link-ag.net', () => {
    const url = new URL(
      'https://cl.link-ag.net/click/ed473f/b6ca063e?redirect_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkA(url)).toBeUndefined()
  })

  it('should return undefined for another path on link-a.net', () => {
    const url = new URL('https://link-a.net/index.php?mallurl1=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLinkA(url)).toBeUndefined()
  })

  it('should return undefined for the gate shape on another host', () => {
    const url = new URL('https://example.com/gate.php?mallurl1=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLinkA(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/click_product_link/b6239d/fa5bcb60?redirect_url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLinkA(url)).toBeUndefined()
  })
})
