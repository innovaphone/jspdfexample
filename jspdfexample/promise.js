var Promise = (function () {

    var STATE_PENDING = 'pending';
    var STATE_REJECTED = 'rejected';
    var STATE_FULFILLED = 'fulfilled';

    function Promise(executor) {
        this.state = STATE_PENDING;
        this.value = undefined;
        this.consumers = [];
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (err) {
            // Return a rejected promise when error occurs
            this.reject(err);
        }
    }

    Promise.resolve = function (value) {
        if (this === value) {
            throw new TypeError('Circular reference: promise value is promise itself');
        }

        if (value instanceof Promise) {
            return value;
        }

        if (value === Object(value)) {
            resolvePromiselikeValue(this, value);
            return;
        }

        return new Promise(function (resolve, _reject) {
            resolve(value);
        });
    };

    Promise.reject = function (value) {
        return new Promise(function (_resolve, reject) {
            reject(value);
        });
    };

    Promise.all = function (values) {
        return new Promise(function (resolve, reject) {
            var results = [];
            var completed = 0;

            for (var i = 0; i < values.length; i++) {
                Promise.resolve(values[i]).then(
                    function (value) {
                        results[completed] = value;
                        completed += 1;
                        if (completed === values.length) {
                            resolve(results);
                        }
                    },
                    function (error) { reject(error) }
                );
            }
        });
    };

    Promise.prototype.fulfill = function (value) {
        if (this.state !== STATE_PENDING) return;
        this.state = STATE_FULFILLED;
        this.value = value;
        this.broadcast();
    }

    Promise.prototype.reject = function (reason) {
        if (this.state !== STATE_PENDING) return;
        this.state = STATE_REJECTED;
        this.value = reason;
        this.broadcast();
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var consumer = new Promise(function () { });
        consumer.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        consumer.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.consumers.push(consumer);
        this.broadcast();
        return consumer;
    };

    Promise.prototype.broadcast = function () {
        var promise = this;
        if (this.state === STATE_PENDING) return;
        var callbackName, resolver;
        if (this.state === STATE_FULFILLED) {
            callbackName = 'onFulfilled';
            resolver = 'resolve';
        } else {
            callbackName = 'onRejected';
            resolver = 'reject';
        }

        Timers.setTimeout(function () {
            promise.consumers.splice(0).forEach(function (consumer) {
                try {
                    var callback = consumer[callbackName];
                    if (callback) {
                        consumer.resolve(callback(promise.value));
                    } else {
                        consumer[resolver](promise.value);
                    }
                } catch (e) {
                    consumer.reject(e);
                };
            });
        });
    };

    Promise.prototype.resolve = function (value) {
        if (this === value) {
            throw new TypeError('Circular reference: promise value is promise itself');
        }

        if (value instanceof Promise) {
            value.then(this.resolve.bind(this), this.reject.bind(this));
            return;
        }

        if (value === Object(value)) {
            resolvePromiselikeValue(this, value);
            return;
        }

        this.fulfill(value);
    }

    function resolvePromiselikeValue(promise, value) {
        var wasCalled, then;

        var resolve = function resolve(otherValue) {
            if (wasCalled) return;
            wasCalled = true;
            promise.resolve(otherValue);
        }

        var reject = function reject(reason) {
            if (wasCalled) return;
            wasCalled = true;
            promise.reject(reason);
        }

        try {
            then = value.then;
            if (typeof then === 'function') {
                then.call(value, resolve.bind(promise), reject.bind(promise));
            } else {
                promise.fulfill(value);
            }
        } catch (e) {
            if (wasCalled) return;
            promise.reject(e);
        }
    }

    return Promise;
})();