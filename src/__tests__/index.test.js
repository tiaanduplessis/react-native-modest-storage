import storage from '../'

test('should export storage object', () => {
  expect(storage).toBeDefined()
})

test('should set and get item', async () => {
  await storage.set('foo', { bar: 1 })
  const result = await storage.get('foo')
  expect(result).toEqual({ bar: 1 })
})

test('should set and get multiple items', async () => {
  await storage.set([['key1', { foo: 'bar' }], ['key2', 'baz'], ['test', { obj: 9 }]])
  const result = await storage.get(['key1', 'key2'])
  expect(Array.isArray(result)).toBeTruthy()
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

afterEach(() => {
  storage.clear()
})
