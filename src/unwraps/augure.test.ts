import { describe, expect, it } from 'bun:test'
import { unwrapAugure } from './augure.js'

describe('unwrapAugure', () => {
  it('should extract the target from the click tracker', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/tracking/675251/046070112134991421687249019607-hlcom-presse.com?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5ldSUyRm5ld3MlMkZmciUyRmhlYWRsaW5lcyUyRnNv%0AY2lldHklMkYyMDIzMDYwMVNUTzkzODA0%0A',
    )

    expect(unwrapAugure(url)).toBe(
      'https://www.example.eu/news/fr/headlines/society/20230601STO93804',
    )
  })

  it('should extract the target from a single-line id1', () => {
    const url = new URL(
      'http://wpp.engage.augure.com/pub/tracking/24071/01432818630611411478769509-ogilvy.com?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5jb20lMkZh',
    )

    expect(unwrapAugure(url)).toBe('https://www.example.com/a')
  })

  it('should extract the target from the www tracking path', () => {
    const url = new URL(
      'http://web-profilepr.engage.augure.com/www/tracking/9412/02770812435741506501989752-agence-profile.com?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5jb20lMkZh',
    )

    expect(unwrapAugure(url)).toBe('https://www.example.com/a')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/tracking/554725/03393749411762681513331227939-example.com?id1=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })

  it('should return undefined for an id1 that is not base64', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/tracking/554725/03393749411762681513331227939-example.com?id1=%25%25%25',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })

  it('should return undefined for a malformed escape in the target', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/tracking/554725/03393749411762681513331227939-example.com?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5jb20lMkYlRTAlQTQlQQ%3D%3D',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })

  it('should return undefined for the click tracker without id1', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/tracking/554725/03393749411762681513331227939-example.com',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })

  it('should return undefined for the hosted link page', () => {
    const url = new URL(
      'http://web-engage.augure.com/pub/link/554725/abc.html?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5jb20lMkZh',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/pub/tracking/554725/03393749411762681513331227939-example.com?id1=aHR0cHMlM0ElMkYlMkZ3d3cuZXhhbXBsZS5jb20lMkZh',
    )

    expect(unwrapAugure(url)).toBeUndefined()
  })
})
