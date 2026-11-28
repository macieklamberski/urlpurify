import { describe, expect, it } from 'bun:test'
import { unwrapInvolveAsia } from './involveAsia.js'

describe('unwrapInvolveAsia', () => {
  it('should extract target from url param on a deep link', () => {
    const value = new URL(
      'https://go.isclix.com/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fhuawei-mate-30-pro&utm_source=blog',
    )
    const expected = 'https://www.example.com/products/huawei-mate-30-pro'

    expect(unwrapInvolveAsia(value)).toBe(expected)
  })

  it('should extract target from url param on a deep link with a second id', () => {
    const value = new URL(
      'https://go.isclix.com/deep_link/4637228581288136910/5127144557053758578?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fghe-van-phong',
    )
    const expected = 'https://www.example.com/products/ghe-van-phong'

    expect(unwrapInvolveAsia(value)).toBe(expected)
  })

  it('should extract target from url param on aff_m', () => {
    const value = new URL(
      'https://invol.co/aff_m?offer_id=407&aff_id=2517&source=campaign&url=https%3A%2F%2Fwww.example.com%2Fkpb-express-bus-from-penang',
    )
    const expected = 'https://www.example.com/kpb-express-bus-from-penang'

    expect(unwrapInvolveAsia(value)).toBe(expected)
  })

  it('should return undefined when url param is missing on a deep link', () => {
    const value = new URL('https://go.isclix.com/deep_link/4637228581288136910')

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })

  it('should return undefined for a short link on invol.co', () => {
    const value = new URL(
      'https://invol.co/cljdrqf?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fcosmos-seeds',
    )

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })

  it('should return undefined for a deep link path on invol.co', () => {
    const value = new URL(
      'https://invol.co/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })

  it('should return undefined for a deep link path without an id', () => {
    const value = new URL('https://go.isclix.com/deep_link/?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })

  it('should return undefined for the aff_m path on go.isclix.com', () => {
    const value = new URL(
      'https://go.isclix.com/aff_m?offer_id=407&aff_id=2517&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapInvolveAsia(value)).toBeUndefined()
  })
})
