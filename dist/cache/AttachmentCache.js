"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AttachmentCache_instances, _AttachmentCache_timeLimit, _AttachmentCache_maxSize, _AttachmentCache_cache, _AttachmentCache_dropQueue, _AttachmentCache_timeout;
Object.defineProperty(exports, "__esModule", { value: true });
class AttachmentCache {
    get(key) {
        if (!__classPrivateFieldGet(this, _AttachmentCache_cache, "f").has(key))
            return null;
        const value = __classPrivateFieldGet(this, _AttachmentCache_cache, "f").get(key);
        __classPrivateFieldGet(this, _AttachmentCache_cache, "f").delete(key);
        __classPrivateFieldGet(this, _AttachmentCache_cache, "f").set(key, value);
        if (key in __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")) {
            const timeout = __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key];
            clearTimeout(timeout);
        }
        __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key] = __classPrivateFieldGet(this, _AttachmentCache_instances, "m", _AttachmentCache_timeout).call(this, key);
        return value;
    }
    set(key, value) {
        if (__classPrivateFieldGet(this, _AttachmentCache_cache, "f").has(key)) {
            __classPrivateFieldGet(this, _AttachmentCache_cache, "f").delete(key);
        }
        else if (__classPrivateFieldGet(this, _AttachmentCache_cache, "f").size >= __classPrivateFieldGet(this, _AttachmentCache_maxSize, "f")) {
            const oldestKey = __classPrivateFieldGet(this, _AttachmentCache_cache, "f").keys().next().value;
            __classPrivateFieldGet(this, _AttachmentCache_cache, "f").delete(oldestKey);
        }
        __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key] = __classPrivateFieldGet(this, _AttachmentCache_instances, "m", _AttachmentCache_timeout).call(this, key);
        __classPrivateFieldGet(this, _AttachmentCache_cache, "f").set(key, value);
    }
    delete(key) {
        if (__classPrivateFieldGet(this, _AttachmentCache_cache, "f").has(key)) {
            __classPrivateFieldGet(this, _AttachmentCache_cache, "f").delete(key);
            clearTimeout(__classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key]);
            delete __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key];
        }
    }
    constructor(options) {
        _AttachmentCache_instances.add(this);
        _AttachmentCache_timeLimit.set(this, void 0);
        _AttachmentCache_maxSize.set(this, 12);
        _AttachmentCache_cache.set(this, void 0);
        //Timeouts
        _AttachmentCache_dropQueue.set(this, void 0);
        if (options) {
            __classPrivateFieldSet(this, _AttachmentCache_maxSize, options.maxSize, "f");
            __classPrivateFieldSet(this, _AttachmentCache_timeLimit, options.timeLimit, "f");
        }
        __classPrivateFieldSet(this, _AttachmentCache_dropQueue, {}, "f");
        __classPrivateFieldSet(this, _AttachmentCache_cache, new Map(), "f");
    }
}
_AttachmentCache_timeLimit = new WeakMap(), _AttachmentCache_maxSize = new WeakMap(), _AttachmentCache_cache = new WeakMap(), _AttachmentCache_dropQueue = new WeakMap(), _AttachmentCache_instances = new WeakSet(), _AttachmentCache_timeout = function _AttachmentCache_timeout(key) {
    var _a;
    return setTimeout(() => {
        if (__classPrivateFieldGet(this, _AttachmentCache_cache, "f").has(key)) {
            delete __classPrivateFieldGet(this, _AttachmentCache_dropQueue, "f")[key];
            __classPrivateFieldGet(this, _AttachmentCache_cache, "f").delete(key);
        }
    }, ((_a = __classPrivateFieldGet(this, _AttachmentCache_timeLimit, "f")) !== null && _a !== void 0 ? _a : 60) * 1000);
};
exports.default = AttachmentCache;
