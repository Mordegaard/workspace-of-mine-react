/* global telegram */

export default class TelegramHelpers {
  constructor (manager) {
    this.manager = manager
  }

  arrayToBuffer (array) {
    if (!Array.isArray(array)) {
      throw new Error(`Array is expected but ${typeof array} provided`)
    }

    const writer = new telegram.extensions.BinaryWriter(new Buffer([]))
    writer.write(Buffer.from(array))

    return writer.getValue()
  }
}