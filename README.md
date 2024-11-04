# useVWR Hook

## Overview

VWR is an innovative data-fetching and caching library designed for Vue.js, serving as an alternative to SWR (Stale-While-Revalidate) commonly used in React. VWR allows developers to seamlessly fetch, cache, and revalidate data in real-time, ensuring optimal user experiences with up-to-date content and minimal latency. \
By employing smart caching strategies, VWR improves app performance by revalidating stale data in the background and delivering fresh results without disrupting the user interface. Built with Vue's reactivity in mind, it integrates smoothly with Vue components and provides a familiar API for effortless data management.

## Installation

Ensure that your project is set up to use TypeScript and React. Install any necessary dependencies using:

```bash
npm install vwr-vuejs
```

## Usage

### Function Signature

```typescript
const useVWR = <T>(
    key: string,
    fetcher: Function,
    options: VWROptions = {}
) => { ... }
```

### Parameters

- **`key: string`**: A unique identifier for the data request, ensuring proper caching and reuse.
- **`fetcher: Function`**: A function that performs data fetching. It should ideally be asynchronous and return the data to be cached.
- **`options: VWROptions` (optional)**: Configuration options for the hook.

### Returns

- The hook instance that either reuses an existing request or initializes a new one.

## Example

```typescript
const fetchUserData = async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
};

const MyComponent = () => {
    const userId = '123';
    const userData = useVWR(userId, fetchUserData, {
        RevalidateInterval: 5000, // revalidate every 5 seconds
        ErrorCallback: (error) => console.error('Fetch failed:', error)
    });

    return (
        <div>
            {userData ? (
                <div>User Name: {userData.name}</div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};
```

## Configuration Options (`VWROptions`)

The `VWROptions` class provides additional options for customizing the behavior of the `useVWR` hook:

```typescript
export default class VWROptions {
    RevalidateInterval?: number; // Time interval (in milliseconds) for revalidating the data.
    ErrorCallback?: Function; // Callback function to handle errors during the fetch.
}
```

### Properties

- **`RevalidateInterval`**: (optional) Specifies the interval in milliseconds for revalidating data. Useful for cases where data needs to be kept fresh.
- **`ErrorCallback`**: (optional) A function to be called if an error occurs during the fetching process. This can be used for custom error handling or logging.

## Explanation

- The `useVWR` hook checks if a request associated with the `key` already exists using `vwrExists(key)`.
- If it exists, it reuses the existing data through `reuseVWR<T>(key, fetcher)`.
- If not, it initializes a new data request using `initVWR<T>(key, fetcher, options)`.

## Functions

### `vwrExists(key: string)`

- Checks if a request associated with the `key` exists in the cache.

### `reuseVWR<T>(key: string, fetcher: Function)`

- Reuses an existing data request, returning the cached data.

### `initVWR<T>(key: string, fetcher: Function, options: VWROptions)`

- Initializes a new data request and caches the result for future use.

## Contributing

Contributions are welcome! If you find a bug or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
