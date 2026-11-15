# urlpurify

[![codecov](https://codecov.io/gh/macieklamberski/urlpurify/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlpurify)
[![npm version](https://img.shields.io/npm/v/urlpurify.svg)](https://www.npmjs.com/package/urlpurify)
[![license](https://img.shields.io/npm/l/urlpurify.svg)](https://github.com/macieklamberski/urlpurify/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking parameters. Turn noisy links into clean, direct URLs.

Links from feeds, emails and social platforms rarely point straight at their destination. They pass through search redirects, link shims, email gateways and affiliate networks, and pick up tracking parameters on the way, the link decoration that follows a reader from site to site. urlpurify unwraps 400+ known wrappers and strips 100+ known tracking parameters plus vendor families. Campaign tags like `utm_*` and affiliate ids stay by default: they serve the site, not a tracker. It has no dependencies and runs in any modern JavaScript runtime, browsers included.

[Quick start](#quick-start)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Unwrappers](#unwrappers)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Tracking parameters](#tracking-parameters)
&nbsp;&nbsp;·&nbsp;&nbsp;
[API](#api)

---

## Quick start

```bash
npm install urlpurify
```

Then:

```typescript
import { cleanUrl } from 'urlpurify'

const url = 'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Ffbclid%3Dabc'

cleanUrl(url) // => 'https://example.com/post'
```

## Unwrappers

There are more than 400 unwrappers, each in its own file in [src/unwraps](src/unwraps), with a comment naming the service and the URL shape it handles. Each is exported on its own and belongs to one category. The categories split by what unwrapping takes away from someone, which is what decides whether you want it:

| Category | Export | Unwrapping removes | Default |
| --- | --- | --- | :---: |
| Search clicks | `searchClickUnwrappers` | The search engine's or aggregator's click logging | ☑️ |
| Link shims | `linkShimUnwrappers` | Nothing, or a platform's click count | ☑️ |
| Press releases | `pressReleaseUnwrappers` | The issuer's click stats from the wire | |
| Sign-in shims | `signInShimUnwrappers` | Nothing, but the shim's page needs a sign-in | |
| Security gateways | `securityGatewayUnwrappers` | The gateway's click-time check of the target | |
| Email tracking | `emailTrackingUnwrappers` | The sender's click stats | |
| Affiliate links | `affiliateUnwrappers` | The publisher's commission | |
| Advertising | `advertisingUnwrappers` | Ad click and app install attribution | |
| Click counters | `clickCounterUnwrappers` | A site's or feed's count of which links get clicked | |
| Download measurement | `downloadMeasurementUnwrappers` | A podcast measurement prefix's download counts, or a site's download counts | |
| Archives and proxies | `archiveProxyUnwrappers` | The archived or translated copy: you get the live page | |
| Image proxies | `imageProxyUnwrappers` | The resized or optimized copy: you get the original image | |
| Embed proxies | `embedProxyUnwrappers` | The site's frame around another provider's embed: you get the provider's page | |
| Share intents | `shareIntentUnwrappers` | The share or bookmark form: you get the page being shared | |
| Subscribe intents | `subscribeIntentUnwrappers` | The reader's or app's subscribe page, or a player carrying a feed: you get the feed | |
| Feed tools | `feedToolUnwrappers` | The validator's or proxy's view: you get the feed it was given | |

`defaultUnwrappers` combines the first two. Most of the others cost somebody something or change the page: a feed click counter tells a blog which posts get read, an affiliate link may pay for a small blog, and an archive link points at a copy on purpose.

The intent categories, `shareIntentUnwrappers`, `subscribeIntentUnwrappers` and `feedToolUnwrappers`, hold links that never redirect to what they carry, so unwrapping one changes what a reader would open. They suit a caller collecting feeds or shared pages, not one cleaning links for a reader.

To turn more on, see [Choosing unwrappers](#choosing-unwrappers).

## Tracking parameters

Tracking parameters are grouped like the unwrappers, by what stripping them takes away from someone:

| Category | Export | Stripping removes | Default |
| --- | --- | --- | :---: |
| Click attribution | `clickAttributionParams` | Ad, search and platform click ids | ☑️ |
| Visitor ids | `visitorIdParams` | Ids of one visitor, session, browser or email recipient | ☑️ |
| Session ids | `sessionParams` | A server session id, which never changes what the page shows | ☑️ |
| Housekeeping | `housekeepingParams` | Nothing: cache busters, previews and redirect leftovers | ☑️ |
| Campaign tags | `campaignParams` | The site's own traffic stats, from tags like `utm_*` | |
| Affiliate ids | `affiliateParams` | The publisher's commission | |

`defaultTrackingParams` combines the first four. A campaign tag carries the same value for every reader, so it tells the site where a visit came from and nothing about who made it.

To strip more, see [Choosing tracking parameters](#choosing-tracking-parameters).

## API

### `cleanUrl(url, options?)`

Unwraps wrappers, repeatedly since they nest, then strips tracking parameters. The result is serialized per the URL Standard, and input that can't be parsed comes back unchanged, so the result is always safe to display.

```typescript
import { cleanUrl, defaultTrackingParams, defaultUnwrappers, unwrapWebArchive } from 'urlpurify'

cleanUrl(url, {
  // First match wins per pass.
  unwrappers: [...defaultUnwrappers, unwrapWebArchive],
  // Names, regexes tested on the lowercased name, or entries.
  trackingParams: [
    ...defaultTrackingParams,
    'newsletter_id',
    /^cmp_[a-z0-9_]+$/,
    // Only with a value of 32 hex digits.
    { name: 'token', value: /^[0-9a-f]{32}$/ },
    // Only on these hosts, and `/^/` matches every name.
    { name: /^/, hosts: ['share.example.com', 'go.example.com'] },
  ],
  // The default.
  maxUnwrapDepth: 12,
})
```

An unwrapped target that isn't a usable URL is ignored, and the wrapper is kept.

### `unwrapUrl(url, unwrappers?)`

Runs one pass of the unwrappers and returns the first target, or `undefined`.

### `stripTrackingParams(url, trackingParams?)`

Removes tracking parameters and returns the serialized URL. Both this and `cleanUrl` apply two rules on top of the list:

- A query with a signature (`sig`, `signature`, `X-Amz-Signature` or `X-Goog-Signature`) stays whole, since dropping anything breaks the signature.
- `ts` stays on Alibaba DirectMail click URLs, which fail without it.

A name the list holds is also dropped as a path parameter, as in `/page;jsessionid=<id>`. An entry's `value` is a regex or a function `(value, host) => boolean` tested on the decoded value, and its `hosts` are exact hostnames or a regex, matched without `www.`.

A tracking list is compiled on first use and cached per array. To change it, pass a new array.

### `isTrackingParam(name, value, hostname, trackingParams?)`

Answers whether one query pair is tracking, for a caller filtering pairs itself. The list defaults to `defaultTrackingParams`. A single pair cannot see the rest of the URL, so the two rules above don't apply.

```typescript
import { isTrackingParam, knownTrackingParams } from 'urlpurify'

isTrackingParam('sid', '46551', 'example.com') // false
isTrackingParam('utm_source', 'feed', url.hostname, knownTrackingParams) // true
```

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

A value still encoded after one decode, starting with `http%3A` or `https%3A`, is decoded once more. A malformed escape, or one in a legacy charset such as `%E9` for é in Latin-1, stays as written. For any other shape, write a plain `UrlUnwrapper`: a function that takes a `URL` and returns the target or `undefined`.

### Choosing unwrappers

Spread the categories you want next to the defaults:

```typescript
import { affiliateUnwrappers, cleanUrl, defaultUnwrappers } from 'urlpurify'

cleanUrl(url, { unwrappers: [...defaultUnwrappers, ...affiliateUnwrappers] })
```

### Choosing tracking parameters

Spread the categories you want next to the defaults:

```typescript
import { campaignParams, defaultTrackingParams, stripTrackingParams } from 'urlpurify'

stripTrackingParams(url, [...defaultTrackingParams, ...campaignParams])
```

`knownTrackingParams` holds every known parameter, opt-in categories included. `trackingParamsLiterals` and `trackingParamsPatterns` split its names and regexes, and leave out entries, whose name alone would strip `sid` or `ref` everywhere.
