import { describe, expect, it } from 'bun:test'
import { unwrapPriceGrabber } from './priceGrabber.js'

describe('unwrapPriceGrabber', () => {
  it('should extract the target from the click', () => {
    const url = new URL(
      'http://viglink.pgpartner.com/rd.php?r=25405&m=65053025&q=n&rdgt=1380549254&priceret=60.00&pg=~~3&k=05b57b75d9&source=feed&url=http%3A%2F%2Fwww%2Eexample%2Ecom%2Frifle%2Dparts%2Fstock',
    )

    expect(unwrapPriceGrabber(url)).toBe('http://www.example.com/rifle-parts/stock')
  })

  it('should return undefined when the url param is missing', () => {
    const url = new URL('http://viglink.pgpartner.com/rd.php?r=25405&k=05b57b75d9')

    expect(unwrapPriceGrabber(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://viglink.pgpartner.com/search.php?url=http%3A%2F%2Fexample.com%2F')

    expect(unwrapPriceGrabber(url)).toBeUndefined()
  })
})
