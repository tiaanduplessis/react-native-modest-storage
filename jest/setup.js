jest.mock('@react-native-async-storage/async-storage', () => {
  let items = new Map()

  return {
    __esModule: true,
    default: {
      setItem: jest.fn((item, value) => {
        items.set(item, value)
        return Promise.resolve(value)
      }),
      multiSet: jest.fn((item, value) => {
        item.forEach(([key, value]) => {
          items.set(key, value)
        })
        return Promise.resolve(value)
      }),
      getItem: jest.fn((item, value) => {
        return Promise.resolve(items.has(item) ? items.get(item) : null)
      }),
      multiGet: jest.fn((keys) => {
        const result = keys.map(key => [key, items.has(key) ? items.get(key) : null])
        return Promise.resolve(result)
      }),
      removeItem: jest.fn((item) => {
        return Promise.resolve(items.delete(item))
      }),
      multiRemove: jest.fn((keys) => {
        keys.forEach(key => items.delete(key))
        return Promise.resolve()
      }),
      mergeItem: jest.fn(() => Promise.resolve()),
      multiMerge: jest.fn(() => Promise.resolve()),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Array.from(items.keys()))
      }),
      clear: jest.fn(() => {
        items = new Map()
        return Promise.resolve()
      })
    }
  }
}, { virtual: true })
