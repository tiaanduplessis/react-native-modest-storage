<h1 align="center">💾 react-native-modest-storage 💾</h1>
<div align="center">
  <strong>A modest wrapper around the AsyncStorage API</strong>
</div>
<br>
<div align="center">
    <a href="https://npmjs.org/package/react-native-modest-storage">
      <img src="https://img.shields.io/npm/v/react-native-modest-storage.svg?style=flat-square" alt="NPM version" />
    </a>
    <a href="https://npmjs.org/package/react-native-modest-storage">
    <img src="https://img.shields.io/npm/dm/react-native-modest-storage.svg?style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/feross/standard">
      <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
    </a>
    <a href="https://travis-ci.org/tiaanduplessis/react-native-modest-storage">
      <img src="https://img.shields.io/travis/tiaanduplessis/react-native-modest-storage/master.svg?style=flat-square" alt="Travis Build" />
    </a>
    <a href="https://github.com/RichardLitt/standard-readme)">
      <img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="Standard Readme" />
    </a>
    <a href="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-modest-storage">
      <img src="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-modest-storage.svg?style=flat-square" alt="GitHub version" />
   </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="tiaanduplessis.co.za">Tiaan</a> and <a href="https://github.com/tiaanduplessis/react-native-modest-storage/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#about">About</a></li>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api">API</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## About

This module is just a modest wrapper around [React Native](https://facebook.github.io/react-native/)'s [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) API. It's purpose is to provide a cleaner API for persisting data.

## Install

```sh
$ npm install --save react-native-modest-storage
```

```sh
$ yarn add react-native-modest-storage
```

## Usage

```js
import storage from 'react-native-modest-storage'

async function doStuff() {
  await storage.set('aKey', { Hello: 'World'})
  await storage.set('otherKey', 5)
  await storage.get('aKey').then(console.log) // {Hello: "World"}
  await storage.keys().then(console.log) ["otherKey", "aKey"]
  await storage.update('aKey', {Hello: 'is it me your looking for.'})
  await storage.get('aKey').then(console.log) // {Hello: "is it me your looking for."}
  await storage.remove('otherKey')
  await storage.get('otherKey').then(console.log) // null
  await storage.set([['key1', {foo: 'bar'}], ['key2', 'baz'], ['test', {obj: 9}]])
  await storage.get('key1').then(console.log) // {foo: "bar"}
  await storage.get('test').then(console.log)
  await storage.clear()
}

doStuff()
```

## API

### get

Retreive value from AsyncStorage based on key.
Wrapper around getItem & multiGet.

**Parameters**

-   `key`

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** value of key

### set

Persist a value to AsyncStorage.
Wrapper around setItem & multiSet.

**Parameters**

-   `value` **Any** to persist
-   `key`

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

### update

Update key with value by merging.
Wrapper around mergeItem & multiMerge.

**Parameters**

-   `value` **any** to update
-   `key`

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

### remove

Remove a key from AsyncStorage.
Wrapper around removeItem & multiRemove.

**Parameters**

-   `key`

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

### clear

Erase all AsyncStorage data.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

### keys

Retreive all the keys stored in AsyncStorage of application.
Wrapper around getAllKeys

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

## Contribute

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Licensed under the MIT License.
