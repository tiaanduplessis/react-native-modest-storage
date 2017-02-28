/**
 *
 * @name react-native-modest-storage
 * @version 1.0.0
 * @author Tiaan du Plessis
 * @license MIT
 */

'use strict'

import { AsyncStorage } from 'react-native'

/**
 * Retreive value from AsyncStorage based on key.
 * Wrapper around getItem & multiGet.
 * @param {String, Array} key to lookup
 * @returns {Promise} value of key
 */
function get (key) {
  // Determine if get or multiGet should be performed
  if (Array.isArray(key)) {
    return AsyncStorage.multiGet(key).then((values) => {
      return values.map((value) => {
        // Index 0 contains keys, index 1 values
        return JSON.parse(value[1])
      })
    })
  } else {
    return AsyncStorage.getItem(key).then(JSON.parse)
  }
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
    return AsyncStorage.multiSet(key)
  } else {
    return AsyncStorage.setItem(key, JSON.stringify(value))
  }
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
    return AsyncStorage.multiMerge(key.map((pair) => {
      return [pair[0], JSON.stringify(pair[1])]
    }))
  }

  return AsyncStorage.mergeItem(key, JSON.stringify(value))
}

/**
 * Remove a key from AsyncStorage.
 * Wrapper around removeItem & multiRemove.
 * @param {String, Array} key to remove
 * @returns {Promise}
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
