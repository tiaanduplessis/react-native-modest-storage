beforeEach(() => {
  jest.resetModules()
  jest.doMock('react-native', () => {
    throw new Error('The removed React Native AsyncStorage export must not be loaded')
  })
})

test.each([true, false])('should lazily load the scoped package (default export: %s)', async (defaultExport) => {
  const native = { getAllKeys: jest.fn(() => Promise.resolve(['saved'])) }
  const load = jest.fn(() => defaultExport ? { __esModule: true, default: native } : native)
  jest.doMock('@react-native-async-storage/async-storage', load, { virtual: true })

  const storage = require('../../').default
  expect(load).not.toHaveBeenCalled()
  expect(await storage.keys()).toEqual(['saved'])
  expect(await storage.keys()).toEqual(['saved'])
  expect(load).toHaveBeenCalledTimes(1)
  expect(native.getAllKeys).toHaveBeenCalledTimes(2)
})

test('should allow injection without loading a native module', async () => {
  const load = jest.fn(() => { throw new Error('Native module is unavailable') })
  jest.doMock('@react-native-async-storage/async-storage', load, { virtual: true })
  const storage = require('../../').default
  storage.setAsyncStorage({ getAllKeys: () => Promise.resolve([]) })
  expect(await storage.keys()).toEqual([])
  expect(load).not.toHaveBeenCalled()
})

test('should expose native module loading errors on first use', () => {
  const error = new Error('Native module is unavailable')
  jest.doMock('@react-native-async-storage/async-storage', () => { throw error }, { virtual: true })
  const storage = require('../../').default
  expect(() => storage.keys()).toThrow(error)
})
