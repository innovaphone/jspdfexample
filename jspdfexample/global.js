// https://wiki.duktape.org/howtoglobalobjectreference

if (typeof global === 'undefined') {
    (function () {
        var global = new Function('return this;')();
        Object.defineProperty(global, 'global', {
            value: global,
            writable: true,
            enumerable: false,
            configurable: true
        });
    })();
}