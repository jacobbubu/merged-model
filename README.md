# @jacobbubu/merged-model

[![Build Status](https://github.com/jacobbubu/merged-model/workflows/Build%20and%20Release/badge.svg)](https://github.com/jacobbubu/merged-model/actions?query=workflow%3A%22Build+and+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/jacobbubu/merged-model/badge.svg)](https://coveralls.io/github/jacobbubu/merged-model)
[![npm](https://img.shields.io/npm/v/@jacobbubu/merged-model.svg)](https://www.npmjs.com/package/@jacobbubu/merged-model/)

> A subclass of scuttlebutt-pull/model that supports merged values with same key.

## Usage

``` ts
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
```
