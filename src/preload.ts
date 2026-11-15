import { mock } from 'bun:test'
import { join } from 'node:path'
import { isFunction } from 'trousse'
import { getCandidates, withScope } from './scope.js'
import type { UrlUnwrapper, UrlUnwrapperFunction } from './types.js'

// Throws when the unwrapper returns a target for a url its own scope leaves out, so a scope that
// would make mayUnwrap or cleanUrl skip a real wrapper fails the test that fed it the url.
export const guardUnwrapper = (name: string, unwrap: UrlUnwrapper): UrlUnwrapper => {
  const guarded: UrlUnwrapperFunction = (url) => {
    const target = unwrap(url)

    if (target && getCandidates(url, [unwrap]).length === 0) {
      throw new Error(`${name} unwrapped ${url.href}, which its scope leaves out`)
    }

    return target
  }

  if (!unwrap.scope) {
    return guarded
  }

  return withScope(guarded, unwrap.scope)
}

// Replaces every unwrapper in src/unwraps with its guarded form before any test file imports it,
// so every module's own test inputs check its scope. src/defaults.ts must not load before this,
// or its arrays keep the unguarded functions.
const directory = join(import.meta.dirname, 'unwraps')
const paths = Array.from(new Bun.Glob('*.ts').scanSync(directory))
  .filter((file) => !file.endsWith('.test.ts'))
  .map((file) => join(directory, file))

const modules = await Promise.all(paths.map((path) => import(path)))

for (const [order, path] of paths.entries()) {
  const guarded: Record<string, unknown> = {}

  for (const [name, value] of Object.entries<unknown>(modules[order])) {
    if (!name.startsWith('unwrap') || !isFunction(value)) {
      guarded[name] = value
      continue
    }

    guarded[name] = guardUnwrapper(name, value as UrlUnwrapper)
  }

  void mock.module(path, () => guarded)
}
