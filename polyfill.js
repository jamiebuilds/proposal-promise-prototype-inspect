const isPromise = require('is-promise');

const PromiseStatus = Symbol('[[PromiseStatus]]');
const PromiseValue = Symbol('[[PromiseValue]]');

const StatusPending = Symbol('pending');
const StatusResolved = Symbol('resolved');
const StatusRejected = Symbol('resolved');

class PolyfillPromise extends Promise {
  constructor(executor, ...args) {
    super((resolve, reject) => {
      executor(value => {
        this[PromiseStatus] = StatusResolved;
        this[PromiseValue] = value;
        return resolve(value);
      }, value => {
        this[PromiseStatus] = StatusRejected;
        this[PromiseValue] = value;
        return reject(value);
      });
    }, ...args);
    this[PromiseStatus] = StatusPending;
  }

  static isPending(promise) {
    return promise[PromiseStatus] === StatusPending;
  }

  static isResolved(promise) {
    return promise[PromiseStatus] === StatusResolved;
  }

  static isRejected(promise) {
    return promise[PromiseStatus] === StatusRejected;
  }

  static getValue(promise) {
    return promise[PromiseValue];
  }
}

global.Promise = PolyfillPromise;
