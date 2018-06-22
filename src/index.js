import { AsyncStorage } from 'react-native'

function useDefault (def, val) {
  return (val === undefined || val === null) && def
}

/**
 * Retreive value from AsyncStorage based on key.
 * Wrapper around getItem & multiGet.
 *
 * @param {String, Array} key Key to lookup
 * @param {Any} def Default value
 *
 * @returns {Promise} value of key
 *
 * @example
 * storage.get('foo').then(console.log).catch(console.error)
 */
function get (key, def) {
  if (Array.isArray(key)) {
    return AsyncStorage.multiGet(key)
      .then((values) => values.map(([_, value]) => {
        return useDefault(def, value) ? def : JSON.parse(value)
      }))
      .then(results => Promise.all(results))
  }

  return AsyncStorage.getItem(key).then(value => useDefault(def, value) ? def : JSON.parse(value))
}

/**
 * Persist a value to AsyncStorage.
 * Wrapper around setItem & multiSet.
 * @param {String, Array} key for value
 * @param {Any} value to persist
 * @returns {Promise}
 */
function set (key, value) {
  if (Array.isArray(key)) {
    const items = key.map(([key, value]) => [key, JSON.stringify(value)])
    return AsyncStorage.multiSet(items)
  }

  return AsyncStorage.setItem(key, JSON.stringify(value))
}

/**
 * Update key with value by merging.
 * Wrapper around mergeItem & multiMerge.
 * @param {String, Array} key for value
 * @param {any} value to update
 * @returns {Promise}
 */
function update (key, value) {
  if (Array.isArray(key)) {
    return AsyncStorage.multiMerge(key.map(([key, val]) => [key, JSON.stringify(val)]))
  }

  return AsyncStorage.mergeItem(key, JSON.stringify(value))
}

/**
 * Remove a key from AsyncStorage.
 * Wrapper around removeItem & multiRemove.
 * @param {String, Array} key to remove
 * @returns {Promise}
 *
 * @example
 * storage.remove(key).then(console.log).catch(console.error)
 */
function remove (key) {
  if (Array.isArray(key)) {
    return AsyncStorage.multiRemove(key)
  }

  return AsyncStorage.removeItem(key)
}

/**
 * Erase all AsyncStorage data.
 * @returns {Promise}
 */
function clear () {
  return AsyncStorage.clear()
}

/**
 * Retreive all the keys stored in AsyncStorage of application.
 * Wrapper around getAllKeys
 * @returns {Promise}
 */
function keys () {
  return AsyncStorage.getAllKeys()
}

export default {
  get,
  set,
  update,
  remove,
  clear,
  keys}
