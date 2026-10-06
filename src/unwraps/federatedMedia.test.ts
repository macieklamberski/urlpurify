import { describe, expect, it } from 'bun:test'
import { unwrapFederatedMedia } from './federatedMedia.js'

describe('unwrapFederatedMedia', () => {
  it('should extract the target from the r param', () => {
    const url = new URL(
      'http://r1.fmpub.net/?k1=cmx-metric&k2=6143%7C576%7C1495&k3=logo&k4=&r=http%3A%2F%2Fwww.example.com%2Fclk%3B286448087%3B112894804',
    )

    expect(unwrapFederatedMedia(url)).toBe('http://www.example.com/clk;286448087;112894804')
  })

  it('should return undefined when the r param is missing', () => {
    const url = new URL('http://r1.fmpub.net/?k4=7126&k5=578489&img=true')

    expect(unwrapFederatedMedia(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://r1.fmpub.net/ad.js?r=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapFederatedMedia(url)).toBeUndefined()
  })
})
