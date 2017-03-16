((root) => {
  if (
    typeof root.Promise === 'function' &&
    typeof root.Promise.prototype.inspect !== 'function'
  ) {
    const PromiseStatus = Symbol('[[PromiseStatus]]');
    const PromiseValue = Symbol('[[PromiseValue]]');
    const PromiseReason = Symbol('[[PromiseReason]]');

    const StatusPending = Symbol('pending');
    const StatusFulfilled = Symbol('fulfilled');
    const StatusRejected = Symbol('rejected');

    class PolyfillPromise extends root.Promise {
      constructor(executor, ...args) {
        super((resolve, reject) => {
          executor(value => {
            this[PromiseStatus] = StatusFulfilled;
            this[PromiseValue] = value;
            return resolve(value);
          }, reason => {
            this[PromiseStatus] = StatusRejected;
            this[PromiseReason] = reason;
            return reject(reason);
          });
        }, ...args);
        this[PromiseStatus] = StatusPending;
      }

      inspect(promise) {
        switch (this[PromiseStatus]) {
          case StatusPending   : return { state: 'pending' };
          case StatusFulfilled : return { state: 'fulfilled', value: this[PromiseValue] };
          case StatusRejected  : return { state: 'rejected', reason: this[PromiseReason] };
        }
      }
    }

    root.Promise = PolyfillPromise;
  }
}(this));
