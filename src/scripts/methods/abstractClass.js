export default class AbstractClass {
  throwAbstract (methodName) {
    throw new Error(`Method ${methodName} must be implemented in ${this.constructor.name} class.`)
  }
}