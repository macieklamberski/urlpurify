# urlpurifier

[![codecov](https://codecov.io/gh/macieklamberski/urlpurifier/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlpurifier)
[![npm version](https://img.shields.io/npm/v/urlpurifier.svg)](https://www.npmjs.com/package/urlpurifier)
[![license](https://img.shields.io/npm/l/urlpurifier.svg)](https://github.com/macieklamberski/urlpurifier/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking params. Turn noisy links into clean, direct URLs.

Links from feeds, emails and social platforms rarely point straight at their destination. They pass through search redirects, link shims, email gateways and affiliate networks, and pick up tracking params on the way, the link decoration that follows a reader from site to site. urlpurifier unwraps 400+ known wrappers and strips 100+ known tracking params plus vendor families. Campaign tags like `utm_*` and affiliate ids stay by default: they serve the site, not a tracker. It has no dependencies and runs in any modern JavaScript runtime, browsers included.

[Quick start](#quick-start)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Unwrappers](#unwrappers)
&nbsp;&nbsp;·&nbsp;&nbsp;
[Tracking params](#tracking-params)
&nbsp;&nbsp;·&nbsp;&nbsp;
[API](#api)

---

## Quick start

```bash
npm install urlpurifier
```

Then:

```typescript
import { purifyUrl } from 'urlpurifier'

const url = 'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Ffbclid%3Dabc'

purifyUrl(url) // => 'https://example.com/post'
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
| Embed APIs | `embedApiUnwrappers` | The endpoint that returns data about a page: you get the page | |
| Share intents | `shareIntentUnwrappers` | The share or bookmark form: you get the page being shared | |
| Subscribe intents | `subscribeIntentUnwrappers` | The reader's or app's subscribe page, or a player carrying a feed: you get the feed | |
| Feed tools | `feedToolUnwrappers` | The validator's or proxy's view: you get the feed it was given | |
| Generic carriers | `genericCarrierUnwrappers` | The page of any site carrying a url in a `url`, `feedurl`, `moduleurl`, `feed.url`, `.url`, `link`, `redirect`, `to`, `go`, `goto` or `out` param, or glued into its path as `<host>//<url>`, whether it redirects there or takes the url as an argument | |

`defaultUnwrappers` combines the first two. Most of the others cost somebody something or change the page: a feed click counter tells a blog which posts get read, an affiliate link may pay for a small blog, and an archive link points at a copy on purpose.

The intent categories, `shareIntentUnwrappers`, `subscribeIntentUnwrappers` and `feedToolUnwrappers`, hold links that never redirect to what they carry, so unwrapping one changes what a reader would open. They suit a caller collecting feeds or shared pages, not one cleaning links for a reader.

`genericCarrierUnwrappers` reads those params on any host, so it also unwraps a feed generator or a feed that takes a url argument, such as `example.com/rss.php?url=<page>`. Exempt those links before calling it. Spread it last: the first unwrapper that matches wins, and a service's own unwrapper reads its real carrier better.

To turn more on, see [Choosing unwrappers](#choosing-unwrappers).

## Tracking params

Tracking params are grouped like the unwrappers, by what stripping them takes away from someone:

| Category | Export | Stripping removes | Default |
| --- | --- | --- | :---: |
| Click attribution | `clickAttributionParams` | Ad, search and platform click ids | ☑️ |
| Visitor ids | `visitorIdParams` | Ids of one visitor, session, browser or email recipient | ☑️ |
| Session ids | `sessionParams` | A server session id, which never changes what the page shows | ☑️ |
| Housekeeping | `housekeepingParams` | Nothing: cache busters, previews, redirect leftovers and a `ref` naming the URL's own host | ☑️ |
| Campaign tags | `campaignParams` | The site's own traffic stats, from tags like `utm_*` | |
| Affiliate ids | `affiliateParams` | The publisher's commission | |

`defaultTrackingParams` combines the first four. A campaign tag carries the same value for every reader, so it tells the site where a visit came from and nothing about who made it.

To strip more, see [Choosing tracking params](#choosing-tracking-params).

## API

### `purifyUrl(url, options?)`

Unwraps wrappers, repeatedly since they nest, then strips tracking params. The result is serialized per the URL Standard, and input that can't be parsed comes back unchanged, so the result is always safe to display.

```typescript
import { defaultTrackingParams, defaultUnwrappers, purifyUrl, unwrapWebArchive } from 'urlpurifier'

purifyUrl(url, {
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

The earlier names, `cleanUrl` and `CleanUrlOptions`, still work. Both are deprecated and go away in the next major.

### `unwrapUrl(url, unwrappers?)`

Runs one pass of the unwrappers and returns the first target, or `undefined`.

An unwrapper list that arrives a second time is indexed by host and cached per array, so a url runs only the unwrappers that can match its host. To change a list, pass a new array.

### `stripTrackingParams(url, trackingParams?)`

Removes tracking params and returns the serialized URL. Both this and `purifyUrl` apply two rules on top of the list:

- A query with a signature (`sig`, `signature`, `X-Amz-Signature` or `X-Goog-Signature`) stays whole, since dropping anything breaks the signature.
- `ts` stays on Alibaba DirectMail click URLs, which fail without it.

A session id name the list holds is also dropped as a path parameter, as in `/page;jsessionid=<id>`. A wrapper path carrying one, as in `/external-link.jspa;jsessionid=<id>?url=`, is tried again without it, by `purifyUrl` and `unwrapUrl` alike, so it still unwraps while a target carrying one keeps it. An entry's `value` is a regex or a function `(value, host) => boolean` tested on the percent-decoded value, where an escape that is not UTF-8, such as `%FC`, stays as written. Its `hosts` are exact hostnames or a regex, matched as trousse's `isHostOf` matches them, in any case and in Unicode or Punycode, with a host and its `www.` form matching alike.

A tracking list is compiled on first use and cached per array. To change it, pass a new array.

### `isTrackingParam(name, value, hostname, trackingParams?)`

Answers whether one query pair is tracking, for a caller filtering pairs itself. The name and value arrive percent-decoded, as `purifyUrl` decodes them. The list defaults to `defaultTrackingParams`. It sees one query pair and never the path, so the two rules above don't apply and a `;name=value` path param needs `purifyUrl` or `stripTrackingParams`.

```typescript
import { isTrackingParam, knownTrackingParams } from 'urlpurifier'

isTrackingParam('sid', '46551', 'example.com') // false
isTrackingParam('utm_source', 'feed', url.hostname, knownTrackingParams) // true
```

### `createQueryUnwrapper(config)`

Builds an unwrapper for a target that sits in a query parameter:

```typescript
import { createQueryUnwrapper, defaultUnwrappers, purifyUrl } from 'urlpurifier'

const unwrapExample = createQueryUnwrapper({
  // The domain and every subdomain. Use `hosts` for exact hosts or a regex,
  // or `subdomains` to match only the subdomains.
  domains: 'example.com',
  path: '/out',
  params: ['target'],
})

purifyUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

`path` is optional. It takes an exact path or a list of them, both compared in any case, or a regex, tested as written. `params` are tried in order, and the first that holds a value wins.

Two options read a carrier that holds more than a plain value:

- **`index`** picks which value of a repeated param to read, such as `-1` for the last. A tracker nested unencoded in the carrier repeats the param, and the last value is the target.
- **`decode`** decodes the value, such as trousse's `decodeBase64` or `decodeBase64Url` for a base64 carrier. A decoded value that is not an http url is skipped, and the next param is tried.

A value still encoded after one decode, starting with `http%3A` or `https%3A`, is decoded once more. A malformed escape, or one in a legacy charset such as `%E9` for é in Latin-1, stays as written.

The target takes the link's fragment as `createUnwrapper` describes, so `example.com/out?target=https://example.org/guide#install` gives `https://example.org/guide#install`.

`createParamExtractor` and `ParamExtractorConfig`, the names before 3.0, still work and are deprecated.

### `createPathUnwrapper(config)`

Builds an unwrapper for a target glued into the path behind a prefix, as podcast analytics services do. It takes the same `hosts`, `domains` or `subdomains` as `createUnwrapper`:

```typescript
import { createPathUnwrapper, defaultUnwrappers, purifyUrl } from 'urlpurifier'

// prefix.example.com/r/42/www.example.org/episode.mp3 → https://www.example.org/episode.mp3
const unwrapExample = createPathUnwrapper({
  hosts: 'prefix.example.com',
  prefix: /^\/r\/\d+\//,
})

purifyUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

The target keeps the link's query, which the service forwards with it, and takes the link's fragment as `createUnwrapper` describes. A target without a scheme gets `https`. Pass `scheme: 'http'` for a service that forwards to http, or `scheme: 'link'` for one that forwards with the link's own.

For any other shape, use `createUnwrapper`.

### `createUnwrapper(config)`

Builds an unwrapper from a host list and a function that takes a `URL` and returns the target or `undefined`. The function runs only on a url on one of the hosts:

```typescript
import { createUnwrapper } from 'urlpurifier'

const unwrapExample = createUnwrapper({
  // Exact hosts or a regex. Use `domains` to match every subdomain too,
  // or `subdomains` to match only the subdomains.
  hosts: ['go.example.com'],
  unwrap: (url) => {
    const [, target] = url.pathname.split('/out/')

    return target
  },
})
```

Pass exactly one of `hosts`, `domains` or `subdomains`. Each matches as trousse's `isHostOf`, `isHostOrSubdomainOf` or `isSubdomainOf` does. The unwrapper registers its hosts, so `purifyUrl` skips it on every other host. A host given as a regex registers nothing, so its unwrapper runs on every url, as a plain `UrlUnwrapper` function does.

The target takes the link's fragment, unless it holds a fragment of its own. A browser following a redirect lands there too, since the server never sees the fragment. When the link opens a page instead of redirecting, such as a share button, or the wrapper's page reads the fragment itself, pass `ignoreLinkFragment: true`. All three factories take it.

### Choosing unwrappers

Spread the categories you want next to the defaults:

```typescript
import { affiliateUnwrappers, defaultUnwrappers, purifyUrl } from 'urlpurifier'

purifyUrl(url, { unwrappers: [...defaultUnwrappers, ...affiliateUnwrappers] })
```

### Choosing tracking params

Spread the categories you want next to the defaults:

```typescript
import { campaignParams, defaultTrackingParams, stripTrackingParams } from 'urlpurifier'

stripTrackingParams(url, [...defaultTrackingParams, ...campaignParams])
```

`knownTrackingParams` holds every known parameter, opt-in categories included. `trackingParamsLiterals` and `trackingParamsPatterns` split its names and regexes, and leave out entries, whose name alone would strip `sid` or `ref` everywhere.
