# Promise.prototype.inspect

ECMAScript proposal, specs, tests, and reference implementation for `Promise.prototype.inspect`.

## Spec

You can view the spec in [ecmarkup](spec.emu) or rendered as [HTML](https://thejameskyle.github.io/proposal-promise-prototype-inspect/).

## API

### `.inspect()`

`Promise.prototype.inspect` would return one of the following values.

```js
{ state: "pending" }
{ state: "fulfilled", value }
{ state: "rejected", reason }
```

## Rationale

If you have an large intensive set of operations that need to operate on values
stuck in fulfilled promises (but can't get to because of `.then()`), you have
one of two options:

1. Wait until the values are available - which may be a lot longer than a
   single tick but you have no way of knowing.  
2. Run the set of operations again when they are available

But you do not have the option to extract those fulfilled values from the
promises synchronously.

### Example

Imagine you're rendering a user interface. You don't want to block rendering on
anything because that creates a bad user experience.

If you have values that you need for rendering that are inside promises you
have two choices:

- Render a loading screen
- Render part of the UI using what is available

However, if the promises are already fulfilled and are just waiting on
`.then()` to be called now you'll either:

- Flash a single frame of the loading/partial UI
- Recalculate UI within a single frame (potentially dropping a frame if it
  takes too long)

### Optimizing

If we had an Promise `.inspect()` API that allowed us to view the internal
state of a promise, including accessing their fulfilled values, we could unlock
optimizations currently impossible to do with promises alone.

We can write our programs so that they handle the async nature of promises, but
when they have to do something immediately (like render UI) we can check if
values are available synchronously first.

**Before**

```js
function execute(value) { /* ... */ }

let promise = asyncFn();

execute(null);
promise.then(value => execute(value));
```

**After**

```diff
  function execute(value) { /* ... */ }

  let promise = asyncFn();
+ let inspected = promise.inspect();

+ if (inspected.state === 'fulfilled') {
+   execute(inspected.value);
+ } else {
    execute(null);
    promise.then(value => execute(value));
+ }
```

## Status of This Proposal

TBD

Designated TC39 reviewers: TBD
