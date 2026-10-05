import { describe, expect, it } from 'bun:test'
import { unwrapInvolveAsia } from './involveAsia.js'

describe('unwrapInvolveAsia', () => {
  it('should extract target from url param on a deep link', () => {
    const url = new URL(
      'https://go.isclix.com/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fhuawei-mate-30-pro&utm_source=blog',
    )

    expect(unwrapInvolveAsia(url)).toBe('https://www.example.com/products/huawei-mate-30-pro')
  })

  it('should extract target from url param on a deep link with a second id', () => {
    const url = new URL(
      'https://go.isclix.com/deep_link/4637228581288136910/5127144557053758578?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fghe-van-phong',
    )

    expect(unwrapInvolveAsia(url)).toBe('https://www.example.com/products/ghe-van-phong')
  })

  it('should extract target from url param on aff_m', () => {
    const url = new URL(
      'https://invol.co/aff_m?offer_id=407&aff_id=2517&source=campaign&url=https%3A%2F%2Fwww.example.com%2Fkpb-express-bus-from-penang',
    )

    expect(unwrapInvolveAsia(url)).toBe('https://www.example.com/kpb-express-bus-from-penang')
  })

  it('should return undefined when url param is missing on a deep link', () => {
    const url = new URL('https://go.isclix.com/deep_link/4637228581288136910')

    expect(unwrapInvolveAsia(url)).toBeUndefined()
  })

  it('should return undefined for a short link on invol.co', () => {
    const url = new URL(
      'https://invol.co/cljdrqf?url=https%3A%2F%2Fwww.example.com%2Fproducts%2Fcosmos-seeds',
    )

    expect(unwrapInvolveAsia(url)).toBeUndefined()
  })

  it('should return undefined for a deep link path on invol.co', () => {
    const url = new URL(
      'https://invol.co/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapInvolveAsia(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/deep_link/4637228581288136910?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapInvolveAsia(url)).toBeUndefined()
  })
})
