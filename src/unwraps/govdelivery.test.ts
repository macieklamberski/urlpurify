import { describe, expect, it } from 'bun:test'
import { unwrapGovdelivery } from './govdelivery.js'

const tail = '/1/0101019fb000000a-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee-000000/c2lnbmF0dXJl_x-y=452'

describe('unwrapGovdelivery', () => {
  it('should extract target from the path', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fwww.example.gov%2Fnews${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBe('https://www.example.gov/news')
  })

  it('should extract target on links-1', () => {
    const url = new URL(`https://links-1.govdelivery.com/CL0/http:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapGovdelivery(url)).toBe('http://example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fwww.example.gov%2Fnews%3Futm_medium=email%26utm_source=govdelivery${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBe(
      'https://www.example.gov/news?utm_medium=email&utm_source=govdelivery',
    )
  })

  it('should keep the fragment of the target', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2Fa%23top${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBe('https://example.com/a#top')
  })

  it('should restore a percent sign the target had encoded', () => {
    const url = new URL(
      `https://links-1.govdelivery.com/CL0/https:%2F%2Fexample.com%2FBudget%2520Documents%2Fplan.pdf${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBe('https://example.com/Budget%20Documents/plan.pdf')
  })

  it('should ignore a ref param the feed provider appended', () => {
    const url = new URL(
      `https://links-1.govdelivery.com/CL0/https:%2F%2Fexample.com%2F${tail}?ref=example.org`,
    )

    expect(unwrapGovdelivery(url)).toBe('https://example.com/')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fsafelinks.example.com%2F%3Furl=https%253A%252F%252Fexample.com%252F%26data=05${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBe(
      'https://safelinks.example.com/?url=https%3A%2F%2Fexample.com%2F&data=05',
    )
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(`https://links-3.govdelivery.com/CL0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapGovdelivery(url)).toBe('https://example.com/')
  })

  it('should return undefined when the signature segments are missing', () => {
    const url = new URL('https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F/1')

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined when the target segment is empty', () => {
    const url = new URL('https://links-2.govdelivery.com/CL0//1/0101019fb000000a-000000/c2ln')

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined when the link number is not a number', () => {
    const url = new URL(
      'https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F/x/0101019fb000000a-000000/c2ln',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined when the link number is empty', () => {
    const url = new URL(
      'https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F//0101019fb000000a-000000/c2ln',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined when the message id is empty', () => {
    const url = new URL('https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F/1//c2ln')

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined when the signature is empty', () => {
    const url = new URL(
      'https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F/1/0101019fb000000a-000000/',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a path with a prefix before CL0', () => {
    const url = new URL(`https://links-2.govdelivery.com/x/CL0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a path with extra segments', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%2F${tail}/more`,
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a target with literal slashes', () => {
    const url = new URL(`https://links-2.govdelivery.com/CL0/https://example.com/news${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(`https://links-2.govdelivery.com/CL0/javascript:alert(1)${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a malformed percent sequence', () => {
    const url = new URL(
      `https://links-2.govdelivery.com/CL0/https:%2F%2Fexample.com%E0%A4%A${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for the lowercased path', () => {
    const url = new URL(`https://links-2.govdelivery.com/cl0/https:%2f%2fexample.com%2f${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for another path on the domain', () => {
    const url = new URL('https://public.govdelivery.com/accounts/EXAMPLE/subscriber/new')

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(`https://track.example.com/CL0/https:%2F%2Fexample.org%2F${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      `https://links-2.examplegovdelivery.com/CL0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the domain', () => {
    const url = new URL(`https://govdelivery.com.example.org/CL0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })
})
