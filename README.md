# Promise internal fields accessors

ECMAScript proposal, specs, tests, and reference implementation for Promise internal fields accessors. (`Promise.getValue` and `Promise.is{Pending,Resolved,Rejected}`)

## Rationale

Imagine you're writing a program that synchronously renders once per frame.

You're using `import()` to load a component async. While the component is
loading you want to show a loading state.

However, if you have loaded the component already you run into a problem with
`import()` being async. You can't wait until the next tick because your render
is synchronous, and you don't want to show a flash of a loading frame for a
single frame.

If you could inspect the promise to see if it was resolved synchronously and
then retrieve the internal value synchronously, you can retrieve your component
within the same tick and avoid flashing the loading state for a single frame.

```js
let component = null;
let promiseComponent = import("./component").then(loadedComponent => {
  component = loadedComponent;
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

## Specification
You can view the spec in [ecmarkup](spec.emu) or rendered as [HTML](https://thejameskyle.github.io/proposal-promise-getvalue/).

## Status of This Proposal

TBD

Designated TC39 reviewers: TBD