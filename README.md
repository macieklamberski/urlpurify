# urlpurify

[![codecov](https://codecov.io/gh/macieklamberski/urlpurify/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlpurify)
[![npm version](https://img.shields.io/npm/v/urlpurify.svg)](https://www.npmjs.com/package/urlpurify)
[![license](https://img.shields.io/npm/l/urlpurify.svg)](https://github.com/macieklamberski/urlpurify/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking parameters. Turn noisy links into clean, direct URLs.

Links from feeds, emails and social platforms rarely point straight at their destination. They pass through search redirects, link shims, email gateways and affiliate networks, and pick up analytics parameters on the way. urlpurify unwraps 380+ known wrappers and strips 170+ known tracking parameters plus families like `utm_*`. It has no dependencies and runs in any modern JavaScript runtime, browsers included.

## Installation

```bash
npm install urlpurify
```

## Quick start

```typescript
import { cleanUrl } from 'urlpurify'

const url = 'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Futm_source%3Dnewsletter'

cleanUrl(url) // => 'https://example.com/post'
```

## API

### `cleanUrl(url, options?)`

Unwraps wrappers, repeatedly since they nest, then strips tracking parameters. When the input can't be parsed or nothing applies, it comes back unchanged, so the result is always safe to display.

```typescript
import { cleanUrl, defaultTrackingParams, defaultUnwrappers, unwrapWebArchive } from 'urlpurify'

cleanUrl(url, {
  // First match wins per pass.
  unwrappers: [...defaultUnwrappers, unwrapWebArchive],
  // Names, or regexes tested on the lowercased name.
  trackingParams: [...defaultTrackingParams, 'newsletter_id', /^cmp_[a-z0-9_]+$/],
  // The default.
  maxUnwrapDepth: 6,
})
```

An unwrapped target that isn't a usable URL is ignored, and the wrapper is kept.

### `unwrapUrl(url, unwrappers?)`

Runs one pass of the unwrappers and returns the first target, or `undefined`.

### `stripTrackingParams(url, trackingParams?)`

Removes tracking parameters and returns the URL, unchanged when nothing matches. Both this and `cleanUrl` apply three rules on top of the list:

- `ref` is dropped when it names the URL's own host, as in Ghost's `?ref=example.com`, and kept otherwise.
- A query with a signature (`sig`, `signature`, `X-Amz-Signature` or `X-Goog-Signature`) stays whole, since dropping anything breaks the signature.
- `ts` stays on Alibaba DirectMail click URLs, which fail without it.

A tracking list is compiled on first use and cached per array. To change it, pass a new array.

### `createParamExtractor(config)`

Builds an unwrapper for a target that sits in a query parameter:

```typescript
import { cleanUrl, createParamExtractor, defaultUnwrappers } from 'urlpurify'

const unwrapExample = createParamExtractor({
  // The domain and every subdomain. Use `hosts` for exact hosts or a regex.
  domains: 'example.com',
  path: '/out',
  params: ['target'],
})

cleanUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

A value still encoded after one decode, starting with `http%3A` or `https%3A`, is decoded once more. For any other shape, write a plain `UrlUnwrapper`: a function that takes a `URL` and returns the target or `undefined`.

### Tracking parameters

`defaultTrackingParams` holds literal names plus regexes for vendor families like `utm_*`. The two halves are also exported as `trackingParamsLiterals` and `trackingParamsPatterns`.

## Unwrappers

There are more than 380 unwrappers, each in its own file in [src/unwraps](src/unwraps), with a comment naming the service and the URL shape it handles. Each is exported on its own and belongs to one category. The categories split by what unwrapping takes away from someone, which is what decides whether you want it:

| Category | Export | Unwrapping removes | Default |
| --- | --- | --- | :---: |
| Search clicks | `searchClickUnwrappers` | The search engine's or aggregator's click logging | ☑️ |
| Link shims | `linkShimUnwrappers` | Nothing, or the platform's own click count | ☑️ |
| Press releases | `pressReleaseUnwrappers` | The wire's click stats | ☑️ |
| Sign-in shims | `signInShimUnwrappers` | Nothing, but the shim's page needs a sign-in | |
| Security gateways | `securityGatewayUnwrappers` | The gateway's click-time check of the target | |
| Email tracking | `emailTrackingUnwrappers` | The sender's click stats | |
| Affiliate links | `affiliateUnwrappers` | The publisher's commission | |
| Advertising | `advertisingUnwrappers` | Ad click and app install attribution | |
| Download measurement | `downloadMeasurementUnwrappers` | A podcaster's or site's download or click counts | |
| Archives and proxies | `archiveProxyUnwrappers` | The archived or translated copy: you get the live page | |

`defaultUnwrappers` combines the first three. The rest cost somebody something or change the page: an affiliate link may pay for a small blog, and an archive link points at a copy on purpose. To turn more on, spread them next to the defaults:

```typescript
import { affiliateUnwrappers, cleanUrl, defaultUnwrappers } from 'urlpurify'

cleanUrl(url, { unwrappers: [...defaultUnwrappers, ...affiliateUnwrappers] })
```
