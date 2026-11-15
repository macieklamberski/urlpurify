import { describe, expect, it } from 'bun:test'
import { unwrapPinterestPin } from './pinterestPin.js'

describe('unwrapPinterestPin', () => {
  it('should extract the target from the save button', () => {
    const value = new URL(
      'http://pinterest.com/pin/create/button/?url=https://www.example.com/2021/12/cherry-cordial-hot-chocolate-recipes.html&description=Cherry%20Cordial%20Hot%20Chocolate&media=https://example.org/LKEdYil.jpg',
    )
    const expected = 'https://www.example.com/2021/12/cherry-cordial-hot-chocolate-recipes.html'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target from the save button without a trailing slash', () => {
    const value = new URL(
      'http://pinterest.com/pin/create/button?description=PJ%20Ochlan,%20narrator%20extraordinaire&media=https://www.example.com/_Media/pasted-file-2_600.png&url=https://www.example.com/news/pj-ochlan-narrator-extraord.html',
    )
    const expected = 'https://www.example.com/news/pj-ochlan-narrator-extraord.html'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target from the link path', () => {
    const value = new URL(
      'http://pinterest.com/pin/create/link/?url=https%3A%2F%2Fexample.com%2Fnieuws%2Fhet-bewind-van-karel-v-en-filips-ii-een-groot-contrast&media=https%3A%2F%2Fexample.com%2Fimage.jpg',
    )
    const expected =
      'https://example.com/nieuws/het-bewind-van-karel-v-en-filips-ii-een-groot-contrast'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target from the bookmarklet path', () => {
    const value = new URL(
      'https://www.pinterest.com/pin/create/bookmarklet/?url=https%3A%2F%2Fwww.example.com%2Fvegan-corn-ribs%2F&media=https%3A%2F%2Fwww.example.com%2Fwp-content%2Fuploads%2F2025%2F09%2FVegan-Corn-Ribs-5.jpg&description=Vegan+Corn+Ribs&is_video=false',
    )
    const expected = 'https://www.example.com/vegan-corn-ribs/'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target from the scraped path', () => {
    const value = new URL(
      'http://www.pinterest.com/pin/create/scraped/?url=http%3A%2F%2Fexample.com%2Fguest-post-newborn-care-specialist%2F%3Futm_source%3DPost-Button%26utm_medium%3DShare&media=https%3A%2F%2Fexample.com%2Fimage.jpg',
    )
    const expected =
      'http://example.com/guest-post-newborn-care-specialist/?utm_source=Post-Button&utm_medium=Share'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target from the extension path on a country host', () => {
    const value = new URL(
      'http://fr.pinterest.com/pin/create/extension/?url=http%3A%2F%2Fwww.example.com%2Fnetrezo%2Fposts%2Fdenis-lebioda-expose%2Fedit&media=http%3A%2F%2Fwww.example.com%2Fimage.jpg&xm=h&xv=sa1.35&description=',
    )
    const expected = 'http://www.example.com/netrezo/posts/denis-lebioda-expose/edit'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target after a guid param', () => {
    const value = new URL(
      'https://br.pinterest.com/pin/create/button/?guid=KC_ELp0jGyxK-1&url=http%3A%2F%2Fexample.com%2Fsp%2Fempresa-traca-perfil-dos-evangelicos-brasileiros%2F&media=http%3A%2F%2Fexample.com%2Fimage.jpg',
    )
    const expected = 'http://example.com/sp/empresa-traca-perfil-dos-evangelicos-brasileiros/'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract the target on www.pinterest.com.au', () => {
    const value = new URL(
      'https://www.pinterest.com.au/pin/create/button/?url=https%3A%2F%2Fexample.com%2Fa-guide-to-different-types-of-fibres-for-knitting&media=https%3A%2F%2Fexample.com%2Fimage.jpg',
    )
    const expected = 'https://example.com/a-guide-to-different-types-of-fibres-for-knitting'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://pinterest.com/pin/create/button/?url=https%253A%252F%252Fexample.com%252Fcandy_biscuits_and_pineapple_dish&description=candy%2520biscuits',
    )
    const expected = 'https://example.com/candy_biscuits_and_pineapple_dish'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.pinterest.com/Pin/Create/Button/?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapPinterestPin(value)).toBe(expected)
  })

  it('should return undefined when only the media param is present', () => {
    const value = new URL(
      'https://www.pinterest.com/pin/create/button/?media=https%3A%2F%2Fexample.com%2Fimage.jpg&description=Recipe',
    )

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL(
      'https://pinterest.com/pin/create/button/?url=&media=https%3A%2F%2Fexample.com%2Fimage.jpg',
    )

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined for a pin page', () => {
    const value = new URL('https://www.pinterest.com/pin/699113542130419529/')

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined for the find path', () => {
    const value = new URL('https://www.pinterest.com/pin/find/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined for a host ending in a country host', () => {
    const value = new URL(
      'https://www.fr.pinterest.com/pin/create/button/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined for a host starting with a country host', () => {
    const value = new URL(
      'https://fr.pinterest.com.example.com/pin/create/button/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/pin/create/button/?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapPinterestPin(value)).toBeUndefined()
  })
})
