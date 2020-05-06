import {
  Model,
  ScuttlebuttOptions,
  Update,
  UpdateItems,
  ModelValueItems,
} from '@jacobbubu/scuttlebutt-pull'

export class MergedModel extends Model {
  getMergedRecord(update: Update): false | Update {
    const transaction = update[UpdateItems.Data]
    const key = transaction[ModelValueItems.Key]
    const current = this.store[key]

    if (!current) {
      return [...update] as Update
    }

    const currentValue = current[UpdateItems.Data][ModelValueItems.Value]
    const currentTs = current[UpdateItems.Timestamp]
    let value = transaction[ModelValueItems.Value]
    const ts = update[UpdateItems.Timestamp]

    if (typeof currentValue === 'object' && typeof value === 'object' && value !== null) {
      if (currentTs > ts) {
        value = { ...value, ...currentValue }
      } else {
        value = { ...currentValue, ...value }
      }
    } else if (currentTs > ts) {
      return false
    }

    const newUpdate = [...update] as Update
    newUpdate[UpdateItems.Data] = [key, value]
    newUpdate[UpdateItems.Timestamp] = ts
    return newUpdate
  }

  applyUpdate(update: Update) {
    const record = this.getMergedRecord(update)
    const key = update[UpdateItems.Data][ModelValueItems.Key]

    if (record === false) {
      return false
    } else if (record[UpdateItems.Data][ModelValueItems.Value] === null) {
      delete this.store[key]
    } else {
      this.store[key] = record
    }

    this.emit('update', record)

    this.store[key] = record

    this.emit('update', update)
    this.emit('changed', key, record[UpdateItems.Data][ModelValueItems.Value])
    this.emit('changed:' + key, record[UpdateItems.Data][ModelValueItems.Value])
    if (record[UpdateItems.SourceId] !== this.id) {
      this.emit(
        'changedByPeer',
        key,
        record[UpdateItems.Data][ModelValueItems.Value],
        record[UpdateItems.From]
      )
    }

    return true
  }
}
