jest.mock('react-native', () => {
  let items = {}

  return {
    AsyncStorage: {
      setItem: jest.fn((item, value) => {
        items[item] = value
        return Promise.resolve(value)
      }),
      multiSet: jest.fn((item, value) => {
        item.forEach(([key, value]) => {
          items[key] = value
        })
        return Promise.resolve(value)
      }),
      getItem: jest.fn((item, value) => {
        return Promise.resolve(items[item])
      }),
      multiGet: jest.fn((keys) => {
        const result = keys.map(key => [key, items[key]])
        return Promise.resolve(result)
      }),
      removeItem: jest.fn((item) => {
        return Promise.resolve(delete items[item])
      }),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Object.keys(items))
      }),
      clear: jest.fn(() => {
        items = {}
        return Promise.resolve()
      })
    }
  }
})
