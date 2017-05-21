(root => {
  if (
    typeof root.Promise === 'function' &&
    typeof root.Promise.prototype.inspect !== 'function'
  ) {
    const internalStateProp = Symbol('InternalState');

    class InspectablePromise extends root.Promise {
      constructor(executor) {
        let internal = {state: 'pending'};

        super((resolve, reject) => {
          executor(
            value => {
              internal.state = 'fulfilled';
              internal.value = value;
              return resolve(value);
            },
            reason => {
              internal.state = 'rejected';
              internal.reason = reason;
              return reject(reason);
            },
          );
        });

        this[internalStateProp] = internal;
      }

      inspect(promise) {
        return Object.assign({}, this[internalStateProp]);
      }
    }

    root.Promise = InspectablePromise;
  }
})(this);
