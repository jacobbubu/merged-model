import { link } from '@jacobbubu/scuttlebutt-pull'
import { MergedModel } from '../src'

describe('MergedModel', () => {
  const expected = {
    key: 'foo',
    valueA: { foo: 'one' },
    valueB: { bar: 'two' },
  }

  it('local change', (done) => {
    const a = new MergedModel('A')

    let c = 2

    a.on('changed', (key, value) => {
      if (c === 2) {
        expect(value).toEqual(expected.valueA)
      } else {
        expect(value).toEqual({ ...expected.valueA, ...expected.valueB })
      }
      if (!--c) done()
    })

    a.set(expected.key, expected.valueA)
    a.set(expected.key, expected.valueB)
  })

  it('change before sync', (done) => {
    const a = new MergedModel('A')
    const b = new MergedModel('B')

    const s1 = a.createStream({ name: 'a->b' })
    const s2 = b.createStream({ name: 'b->a' })

    a.set('num', 1)
    b.set('num', 2)
    a.set('foo', { foo: 'one' })
    b.set('foo', { bar: 'two' })

    s2.on('synced', () => {
      expect(b.toJSON()).toEqual({ num: 2, foo: { foo: 'one', bar: 'two' } })
      done()
    })

    link(s1, s2)
  })
})
