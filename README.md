# Promise.prototype.inspect

ECMAScript proposal, specs, tests, and reference implementation for `Promise.prototype.inspect`.

## Spec

You can view the spec in [ecmarkup](spec.emu) or rendered as [HTML](https://thejameskyle.github.io/proposal-promise-prototype-inspect/).

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
function syncRender() {
  let component = null;
  let promise = import("./component").then(loadedComponent => {
    component = loadedComponent.default;
  });

  let inspected = promise.inspect();
  if (inspected.state === 'fulfilled') {
    component = inspected.value.default;
  }

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

`Promise.prototype.inspect` would return one of the following values.

```js
{ state: "pending" }
{ state: "fulfilled", value }
{ state: "rejected", reason }
```

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

## Status of This Proposal

TBD

Designated TC39 reviewers: TBD
