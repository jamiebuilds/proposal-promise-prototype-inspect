# Promise internal fields accessors

ECMAScript proposal, specs, tests, and reference implementation for Promise internal fields accessors. (`Promise.getValue` and `Promise.is{Pending,Resolved,Rejected}`)

## Spec

You can view the spec in [ecmarkup](spec.emu) or rendered as [HTML](https://thejameskyle.github.io/proposal-promise-access-internal-fields/).

## Rationale

Imagine you're writing a program that synchronously renders once per frame.

You're using `import()` to load a component async. While the component is
loading you want to show a loading state.

However, if you have loaded the component already you run into a problem with
`import()` being async. You can't wait until the next tick because your render
is synchronous, and you don't want to show a flash of a loading frame for a
single frame.

If JavaScript has a reflection api for inspecting promises allowing you to
synchronously retrieve the internal value, you could retrieve your component
within the same tick and avoid flashing the loading state for a single frame.

```js
let component = null;
let promiseComponent = import("./component").then(loadedComponent => {
  component = loadedComponent.default;
});

if (Promise.isResolved(promise)) {
  component = Promise.getValue(promise);
}

function syncRender() {
  if (component !== null) {
    draw(component);
  } else {
    draw("Loading...");
  }

  requestAnimationFrame(syncRender);
}

requestAnimationFrame(syncRender);
```

The same argument can be made any time you have a promise that could be
resolved synchronously. Waiting for the next tick isn't always an option.

There are other forms other than `import()`: `fetch()` or any other promise
returning API where the result might be available synchronously (ex: due to
caching or memoization) applies.

Since promises can resolve to any type of value, it's hard to say what
`Promise.getValue` should return when the promise is pending:

- `return undefined` (Bad: `Promise.resolve(undefined)`)
- `throw new Error` (Bad: Awkward API, Performance)
- `return Promise.wellKnownValue` (Bad: Awkward API)

Instead, if we expose the status of the promise before `Promise.getValue()` is
called. We can avoid ambiguity or awkward APIs.

```js
if (Promise.isResolved(promise)) {
  component = Promise.getValue(promise);
}
```

Including `Promise.isRejected` and `Promise.isPending` makes sense once you
already have `Promise.isResolved`.

#### Why not solve for just `import()`?

If you're looking to make a synchronous optimization like the one in the
example above, it's going to end up applying to any promise.

Instead of an `import()` it could be a `fetch()` with a cached result.

```js
fetch('./data.json')
```

It could be a memoized async function.

```js
let doSomething = memoize(async () => {
  // ...
});
```

If you're writing code that accepts a promise and you want to optimize the
synchronous case, you'll want to accept any promise and not just the qualified
ones.

### Why methods on `Promise` instead of `Promise.prototype`?

These should be considered reflection apis, we don't want users
accidentally using them because they don't understand async vs sync.

```js
let value = fetch('./data.json').getValue();
```

These could even get pushed to `Reflect` as `Reflect.getPromiseValue` and
`Reflect.isPromiseResolved` to better communicate that they are not meant for
everyday use.

## Status of This Proposal

TBD

Designated TC39 reviewers: TBD
