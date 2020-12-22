# ⏱ async

![lint status](https://github.com/rishiosaur/async/workflows/lint/badge.svg)
![format status](https://github.com/rishiosaur/async/workflows/format/badge.svg)
![format status](https://github.com/rishiosaur/async/workflows/build/badge.svg)
![GitHub](https://img.shields.io/github/license/rishiosaur/async)
![GitHub issues](https://img.shields.io/github/issues/rishiosaur/async)
![GitHub contributors](https://img.shields.io/github/contributors/rishiosaur/async)
![GitHub last commit](https://img.shields.io/github/last-commit/rishiosaur/async)
![npm](https://img.shields.io/npm/v/@rishiosaur/async)

A tiny asynchronous effect library for React.

## Installation

Just run `yarn add @rishiosaur/async` or `npm i @rishiosaur/async` (whichever floats your boat) to grab the latest version.

## Usage

`async` comes with two kinds of hooks: `usePromiseEffect` and `useAsyncEffect`. Note: most implementations of promise/asynchronous effects are largely the same—this one just happens to be a little bit faster and has some great types.

### `usePromiseEffect`

This hook returns an array of `[value, loading, error]`; the main hook passed to it must return some `Promise<T>`.

All error handling and internal state management is done for you; all you have to do is write the promise resolution logic!

Basic Example:

```typescript
const App = () => {
  const [value, loading, err] = usePromiseEffect(() =>
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((response) =>
      response.json()
    )
  );

  return (
    <>
      <p>
        {!loading
          ? err
            ? JSON.stringify(err, null, 2)
            : JSON.stringify(value, null, 2)
          : 'Loading'}
      </p>
    </>
  );
};
```

### `useAsyncEffect`

This is much like `usePromiseEffect`, but it's much more like React's internal `useEffect` than anything:

Basic example:

```typescript
function App() {
  const [state, setState] = useState();

  useAsyncEffect(async () => {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/posts/50`
    ).then((res) => res.json());

    setState(data);
  });

  return (
    <>
      <p>{JSON.stringify(state, null, 2)}</p>
    </>
  );
}
```

---

## Notes about usage

Unlike React's `useEffect`, both hooks come with dependency array defaults; you just need to supply the hooks.

`useAsyncEffect` also has settings for cleanup functions & mounted states.
