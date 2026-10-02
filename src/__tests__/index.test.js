import storage from '../'
import AsyncStorage from '@react-native-async-storage/async-storage'

beforeEach(async () => {
  storage.setAsyncStorage(AsyncStorage)
  await storage.clear()
  jest.clearAllMocks()
})

test('should export storage object', () => {
  expect(storage).toBeDefined()
})

test('should set and get item', async () => {
  await storage.set('foo', { bar: 1 })
  const result = await storage.get('foo')
  expect(result).toEqual({ bar: 1 })
})

test('should not parse non JSON values', async () => {
  await storage.set('foo', 'bar')
  const result = await storage.get('foo')
  expect(result).toBe('bar')
})

test('should set and get multiple items', async () => {
  await storage.set([['key1', { foo: 'bar' }], ['key2', 'baz'], ['test', { obj: 9 }]])
  const result = await storage.get(['key1', 'key2'])
  expect(result).toEqual([{ foo: 'bar' }, 'baz'])
  expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
    ['key1', '{"foo":"bar"}'], ['key2', '"baz"'], ['test', '{"obj":9}']
  ])
})

test('should use default when getting key that doesn\'t  exist', async () => {
  const result = await storage.get('bar', 10)
  expect(result).toBe(10)
})

test('should get all keys', async () => {
  await storage.set([['key1', { foo: 'bar' }], ['key2', 'baz']])
  const keys = await storage.keys()
  expect(keys).toEqual(['key1', 'key2'])
})

test.each([
  ['object', { nested: { value: 1 } }],
  ['array', [1, 'two', false]],
  ['string', 'hello'],
  ['number', 42],
  ['zero', 0],
  ['boolean', false],
  ['null', null]
])('should serialize and retrieve a %s', async (_, value) => {
  await storage.set('value', value)
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('value', JSON.stringify(value))
  expect(await storage.get('value')).toEqual(value)
})

test('should return null for a missing key and keep multi-get order', async () => {
  await storage.set('present', false)
  expect(await storage.get('missing')).toBeNull()
  expect(await storage.get(['missing', 'present', 'missing'], 'fallback'))
    .toEqual(['fallback', false, 'fallback'])
})

test('should leave existing non-JSON values unchanged', async () => {
  await AsyncStorage.setItem('raw', 'not JSON')
  await AsyncStorage.setItem('empty', '')
  expect(await storage.get(['raw', 'empty'])).toEqual(['not JSON', ''])
})

test('should delegate serialized updates to native merge methods', async () => {
  await storage.update('key', { nested: { added: true } })
  expect(AsyncStorage.mergeItem).toHaveBeenCalledWith('key', '{"nested":{"added":true}}')
  await storage.update([['first', { a: 1 }], ['second', { b: 2 }]])
  expect(AsyncStorage.multiMerge).toHaveBeenCalledWith([
    ['first', '{"a":1}'], ['second', '{"b":2}']
  ])
})

test('should remove single and multiple keys', async () => {
  await storage.set([['first', 1], ['second', 2], ['third', 3]])
  await storage.remove('first')
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('first')
  expect(await storage.get('first')).toBeNull()
  await storage.remove(['second', 'third'])
  expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['second', 'third'])
  expect(await storage.keys()).toEqual([])
})

test('should clear all stored values', async () => {
  await storage.set('key', 'value')
  await storage.clear()
  expect(AsyncStorage.clear).toHaveBeenCalledTimes(1)
  expect(await storage.keys()).toEqual([])
})

test('should preserve empty batch behavior', async () => {
  expect(await storage.get([])).toEqual([])
  await storage.set([])
  await storage.update([])
  await storage.remove([])
  expect(AsyncStorage.multiSet).toHaveBeenCalledWith([])
  expect(AsyncStorage.multiMerge).toHaveBeenCalledWith([])
  expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([])
})

test.each([
  ['get', ['key'], 'multiGet'],
  ['get', [['first', 'second']], 'multiGet'],
  ['set', ['key', 'value'], 'setItem'],
  ['set', [[['key', 'value']]], 'multiSet'],
  ['update', ['key', { value: 1 }], 'mergeItem'],
  ['update', [[['key', { value: 1 }]]], 'multiMerge'],
  ['remove', ['key'], 'removeItem'],
  ['remove', [['first', 'second']], 'multiRemove'],
  ['clear', [], 'clear'],
  ['keys', [], 'getAllKeys']
])('should propagate %s errors from %s through %s', async (method, args, nativeMethod) => {
  const error = new Error('native storage failed')
  AsyncStorage[nativeMethod].mockRejectedValueOnce(error)
  await expect(storage[method](...args)).rejects.toBe(error)
})

test('should preserve serialization errors without writing', () => {
  const circular = {}
  circular.self = circular
  expect(() => storage.set('key', circular)).toThrow(TypeError)
  expect(AsyncStorage.setItem).not.toHaveBeenCalled()
})

test('should continue supporting injected storage implementations', async () => {
  const injected = { multiGet: jest.fn(() => Promise.resolve([['key', '{"ok":true}']])) }
  storage.setAsyncStorage(injected)
  expect(await storage.get('key')).toEqual({ ok: true })
  expect(injected.multiGet).toHaveBeenCalledWith(['key'])
  expect(AsyncStorage.multiGet).not.toHaveBeenCalled()
})
