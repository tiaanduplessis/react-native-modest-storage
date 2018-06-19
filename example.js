import storage from 'react-native-modest-storage'

async function doStuff () {
  await storage.set('aKey', { Hello: 'World' })
  await storage.set('otherKey', 5)
  await storage.get('aKey').then(console.log) // {Hello: "World"}
  await storage.keys().then(console.log)// ['otherKey', 'aKey']
  await storage.update('aKey', { Hello: 'is it me your looking for.' })
  await storage.get('aKey').then(console.log) // {Hello: "is it me your looking for."}
  await storage.remove('otherKey')
  await storage.get('otherKey').then(console.log) // null
  await storage.set([['key1', { foo: 'bar' }], ['key2', 'baz'], ['test', { obj: 9 }]])
  await storage.get('key1').then(console.log) // {foo: "bar"}
  await storage.get('test').then(console.log)
  await storage.clear()
}

doStuff()
