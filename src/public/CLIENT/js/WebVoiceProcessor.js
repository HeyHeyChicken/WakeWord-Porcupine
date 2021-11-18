var WebVoiceProcessor = (function (exports) {
    'use strict';

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }

        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }

    function _asyncToGenerator(fn) {
        return function () {
            var self = this,
                args = arguments;
            return new Promise(function (resolve, reject) {
                var gen = fn.apply(self, args);

                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }

                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }

                _next(undefined);
            });
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    function createCommonjsModule(fn) {
        var module = { exports: {} };
        return fn(module, module.exports), module.exports;
    }

    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var runtime_1 = createCommonjsModule(function (module) {
        var runtime = (function (exports) {

            var Op = Object.prototype;
            var hasOwn = Op.hasOwnProperty;
            var undefined$1; // More compressible than void 0.
            var $Symbol = typeof Symbol === "function" ? Symbol : {};
            var iteratorSymbol = $Symbol.iterator || "@@iterator";
            var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
            var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

            function define(obj, key, value) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
                return obj[key];
            }
            try {
                // IE 8 has a broken Object.defineProperty that only works on DOM objects.
                define({}, "");
            } catch (err) {
                define = function(obj, key, value) {
                    return obj[key] = value;
                };
            }

            function wrap(innerFn, outerFn, self, tryLocsList) {
                // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                var generator = Object.create(protoGenerator.prototype);
                var context = new Context(tryLocsList || []);

                // The ._invoke method unifies the implementations of the .next,
                // .throw, and .return methods.
                generator._invoke = makeInvokeMethod(innerFn, self, context);

                return generator;
            }
            exports.wrap = wrap;

            // Try/catch helper to minimize deoptimizations. Returns a completion
            // record like context.tryEntries[i].completion. This interface could
            // have been (and was previously) designed to take a closure to be
            // invoked without arguments, but in all the cases we care about we
            // already have an existing method we want to call, so there's no need
            // to create a new function object. We can even get away with assuming
            // the method takes exactly one argument, since that happens to be true
            // in every case, so we don't have to touch the arguments object. The
            // only additional allocation required is the completion record, which
            // has a stable shape and so hopefully should be cheap to allocate.
            function tryCatch(fn, obj, arg) {
                try {
                    return { type: "normal", arg: fn.call(obj, arg) };
                } catch (err) {
                    return { type: "throw", arg: err };
                }
            }

            var GenStateSuspendedStart = "suspendedStart";
            var GenStateSuspendedYield = "suspendedYield";
            var GenStateExecuting = "executing";
            var GenStateCompleted = "completed";

            // Returning this object from the innerFn has the same effect as
            // breaking out of the dispatch switch statement.
            var ContinueSentinel = {};

            // Dummy constructor functions that we use as the .constructor and
            // .constructor.prototype properties for functions that return Generator
            // objects. For full spec compliance, you may wish to configure your
            // minifier not to mangle the names of these two functions.
            function Generator() {}
            function GeneratorFunction() {}
            function GeneratorFunctionPrototype() {}

            // This is a polyfill for %IteratorPrototype% for environments that
            // don't natively support it.
            var IteratorPrototype = {};
            IteratorPrototype[iteratorSymbol] = function () {
                return this;
            };

            var getProto = Object.getPrototypeOf;
            var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
            if (NativeIteratorPrototype &&
                NativeIteratorPrototype !== Op &&
                hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
                // This environment has a native %IteratorPrototype%; use it instead
                // of the polyfill.
                IteratorPrototype = NativeIteratorPrototype;
            }

            var Gp = GeneratorFunctionPrototype.prototype =
                Generator.prototype = Object.create(IteratorPrototype);
            GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
            GeneratorFunctionPrototype.constructor = GeneratorFunction;
            GeneratorFunction.displayName = define(
                GeneratorFunctionPrototype,
                toStringTagSymbol,
                "GeneratorFunction"
            );

            // Helper for defining the .next, .throw, and .return methods of the
            // Iterator interface in terms of a single ._invoke method.
            function defineIteratorMethods(prototype) {
                ["next", "throw", "return"].forEach(function(method) {
                    define(prototype, method, function(arg) {
                        return this._invoke(method, arg);
                    });
                });
            }

            exports.isGeneratorFunction = function(genFun) {
                var ctor = typeof genFun === "function" && genFun.constructor;
                return ctor
                    ? ctor === GeneratorFunction ||
                    // For the native GeneratorFunction constructor, the best we can
                    // do is to check its .name property.
                    (ctor.displayName || ctor.name) === "GeneratorFunction"
                    : false;
            };

            exports.mark = function(genFun) {
                if (Object.setPrototypeOf) {
                    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                } else {
                    genFun.__proto__ = GeneratorFunctionPrototype;
                    define(genFun, toStringTagSymbol, "GeneratorFunction");
                }
                genFun.prototype = Object.create(Gp);
                return genFun;
            };

            // Within the body of any async function, `await x` is transformed to
            // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
            // `hasOwn.call(value, "__await")` to determine if the yielded value is
            // meant to be awaited.
            exports.awrap = function(arg) {
                return { __await: arg };
            };

            function AsyncIterator(generator, PromiseImpl) {
                function invoke(method, arg, resolve, reject) {
                    var record = tryCatch(generator[method], generator, arg);
                    if (record.type === "throw") {
                        reject(record.arg);
                    } else {
                        var result = record.arg;
                        var value = result.value;
                        if (value &&
                            typeof value === "object" &&
                            hasOwn.call(value, "__await")) {
                            return PromiseImpl.resolve(value.__await).then(function(value) {
                                invoke("next", value, resolve, reject);
                            }, function(err) {
                                invoke("throw", err, resolve, reject);
                            });
                        }

                        return PromiseImpl.resolve(value).then(function(unwrapped) {
                            // When a yielded Promise is resolved, its final value becomes
                            // the .value of the Promise<{value,done}> result for the
                            // current iteration.
                            result.value = unwrapped;
                            resolve(result);
                        }, function(error) {
                            // If a rejected Promise was yielded, throw the rejection back
                            // into the async generator function so it can be handled there.
                            return invoke("throw", error, resolve, reject);
                        });
                    }
                }

                var previousPromise;

                function enqueue(method, arg) {
                    function callInvokeWithMethodAndArg() {
                        return new PromiseImpl(function(resolve, reject) {
                            invoke(method, arg, resolve, reject);
                        });
                    }

                    return previousPromise =
                        // If enqueue has been called before, then we want to wait until
                        // all previous Promises have been resolved before calling invoke,
                        // so that results are always delivered in the correct order. If
                        // enqueue has not been called before, then it is important to
                        // call invoke immediately, without waiting on a callback to fire,
                        // so that the async generator function has the opportunity to do
                        // any necessary setup in a predictable way. This predictability
                        // is why the Promise constructor synchronously invokes its
                        // executor callback, and why async functions synchronously
                        // execute code before the first await. Since we implement simple
                        // async functions in terms of async generators, it is especially
                        // important to get this right, even though it requires care.
                        previousPromise ? previousPromise.then(
                            callInvokeWithMethodAndArg,
                            // Avoid propagating failures to Promises returned by later
                            // invocations of the iterator.
                            callInvokeWithMethodAndArg
                        ) : callInvokeWithMethodAndArg();
                }

                // Define the unified helper method that is used to implement .next,
                // .throw, and .return (see defineIteratorMethods).
                this._invoke = enqueue;
            }

            defineIteratorMethods(AsyncIterator.prototype);
            AsyncIterator.prototype[asyncIteratorSymbol] = function () {
                return this;
            };
            exports.AsyncIterator = AsyncIterator;

            // Note that simple async functions are implemented on top of
            // AsyncIterator objects; they just return a Promise for the value of
            // the final result produced by the iterator.
            exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
                if (PromiseImpl === void 0) PromiseImpl = Promise;

                var iter = new AsyncIterator(
                    wrap(innerFn, outerFn, self, tryLocsList),
                    PromiseImpl
                );

                return exports.isGeneratorFunction(outerFn)
                    ? iter // If outerFn is a generator, return the full iterator.
                    : iter.next().then(function(result) {
                        return result.done ? result.value : iter.next();
                    });
            };

            function makeInvokeMethod(innerFn, self, context) {
                var state = GenStateSuspendedStart;

                return function invoke(method, arg) {
                    if (state === GenStateExecuting) {
                        throw new Error("Generator is already running");
                    }

                    if (state === GenStateCompleted) {
                        if (method === "throw") {
                            throw arg;
                        }

                        // Be forgiving, per 25.3.3.3.3 of the spec:
                        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                        return doneResult();
                    }

                    context.method = method;
                    context.arg = arg;

                    while (true) {
                        var delegate = context.delegate;
                        if (delegate) {
                            var delegateResult = maybeInvokeDelegate(delegate, context);
                            if (delegateResult) {
                                if (delegateResult === ContinueSentinel) continue;
                                return delegateResult;
                            }
                        }

                        if (context.method === "next") {
                            // Setting context._sent for legacy support of Babel's
                            // function.sent implementation.
                            context.sent = context._sent = context.arg;

                        } else if (context.method === "throw") {
                            if (state === GenStateSuspendedStart) {
                                state = GenStateCompleted;
                                throw context.arg;
                            }

                            context.dispatchException(context.arg);

                        } else if (context.method === "return") {
                            context.abrupt("return", context.arg);
                        }

                        state = GenStateExecuting;

                        var record = tryCatch(innerFn, self, context);
                        if (record.type === "normal") {
                            // If an exception is thrown from innerFn, we leave state ===
                            // GenStateExecuting and loop back for another invocation.
                            state = context.done
                                ? GenStateCompleted
                                : GenStateSuspendedYield;

                            if (record.arg === ContinueSentinel) {
                                continue;
                            }

                            return {
                                value: record.arg,
                                done: context.done
                            };

                        } else if (record.type === "throw") {
                            state = GenStateCompleted;
                            // Dispatch the exception by looping back around to the
                            // context.dispatchException(context.arg) call above.
                            context.method = "throw";
                            context.arg = record.arg;
                        }
                    }
                };
            }

            // Call delegate.iterator[context.method](context.arg) and handle the
            // result, either by returning a { value, done } result from the
            // delegate iterator, or by modifying context.method and context.arg,
            // setting context.delegate to null, and returning the ContinueSentinel.
            function maybeInvokeDelegate(delegate, context) {
                var method = delegate.iterator[context.method];
                if (method === undefined$1) {
                    // A .throw or .return when the delegate iterator has no .throw
                    // method always terminates the yield* loop.
                    context.delegate = null;

                    if (context.method === "throw") {
                        // Note: ["return"] must be used for ES3 parsing compatibility.
                        if (delegate.iterator["return"]) {
                            // If the delegate iterator has a return method, give it a
                            // chance to clean up.
                            context.method = "return";
                            context.arg = undefined$1;
                            maybeInvokeDelegate(delegate, context);

                            if (context.method === "throw") {
                                // If maybeInvokeDelegate(context) changed context.method from
                                // "return" to "throw", let that override the TypeError below.
                                return ContinueSentinel;
                            }
                        }

                        context.method = "throw";
                        context.arg = new TypeError(
                            "The iterator does not provide a 'throw' method");
                    }

                    return ContinueSentinel;
                }

                var record = tryCatch(method, delegate.iterator, context.arg);

                if (record.type === "throw") {
                    context.method = "throw";
                    context.arg = record.arg;
                    context.delegate = null;
                    return ContinueSentinel;
                }

                var info = record.arg;

                if (! info) {
                    context.method = "throw";
                    context.arg = new TypeError("iterator result is not an object");
                    context.delegate = null;
                    return ContinueSentinel;
                }

                if (info.done) {
                    // Assign the result of the finished delegate to the temporary
                    // variable specified by delegate.resultName (see delegateYield).
                    context[delegate.resultName] = info.value;

                    // Resume execution at the desired location (see delegateYield).
                    context.next = delegate.nextLoc;

                    // If context.method was "throw" but the delegate handled the
                    // exception, let the outer generator proceed normally. If
                    // context.method was "next", forget context.arg since it has been
                    // "consumed" by the delegate iterator. If context.method was
                    // "return", allow the original .return call to continue in the
                    // outer generator.
                    if (context.method !== "return") {
                        context.method = "next";
                        context.arg = undefined$1;
                    }

                } else {
                    // Re-yield the result returned by the delegate method.
                    return info;
                }

                // The delegate iterator is finished, so forget it and continue with
                // the outer generator.
                context.delegate = null;
                return ContinueSentinel;
            }

            // Define Generator.prototype.{next,throw,return} in terms of the
            // unified ._invoke helper method.
            defineIteratorMethods(Gp);

            define(Gp, toStringTagSymbol, "Generator");

            // A Generator should always return itself as the iterator object when the
            // @@iterator function is called on it. Some browsers' implementations of the
            // iterator prototype chain incorrectly implement this, causing the Generator
            // object to not be returned from this call. This ensures that doesn't happen.
            // See https://github.com/facebook/regenerator/issues/274 for more details.
            Gp[iteratorSymbol] = function() {
                return this;
            };

            Gp.toString = function() {
                return "[object Generator]";
            };

            function pushTryEntry(locs) {
                var entry = { tryLoc: locs[0] };

                if (1 in locs) {
                    entry.catchLoc = locs[1];
                }

                if (2 in locs) {
                    entry.finallyLoc = locs[2];
                    entry.afterLoc = locs[3];
                }

                this.tryEntries.push(entry);
            }

            function resetTryEntry(entry) {
                var record = entry.completion || {};
                record.type = "normal";
                delete record.arg;
                entry.completion = record;
            }

            function Context(tryLocsList) {
                // The root entry object (effectively a try statement without a catch
                // or a finally block) gives us a place to store values thrown from
                // locations where there is no enclosing try statement.
                this.tryEntries = [{ tryLoc: "root" }];
                tryLocsList.forEach(pushTryEntry, this);
                this.reset(true);
            }

            exports.keys = function(object) {
                var keys = [];
                for (var key in object) {
                    keys.push(key);
                }
                keys.reverse();

                // Rather than returning an object with a next method, we keep
                // things simple and return the next function itself.
                return function next() {
                    while (keys.length) {
                        var key = keys.pop();
                        if (key in object) {
                            next.value = key;
                            next.done = false;
                            return next;
                        }
                    }

                    // To avoid creating an additional object, we just hang the .value
                    // and .done properties off the next function object itself. This
                    // also ensures that the minifier will not anonymize the function.
                    next.done = true;
                    return next;
                };
            };

            function values(iterable) {
                if (iterable) {
                    var iteratorMethod = iterable[iteratorSymbol];
                    if (iteratorMethod) {
                        return iteratorMethod.call(iterable);
                    }

                    if (typeof iterable.next === "function") {
                        return iterable;
                    }

                    if (!isNaN(iterable.length)) {
                        var i = -1, next = function next() {
                            while (++i < iterable.length) {
                                if (hasOwn.call(iterable, i)) {
                                    next.value = iterable[i];
                                    next.done = false;
                                    return next;
                                }
                            }

                            next.value = undefined$1;
                            next.done = true;

                            return next;
                        };

                        return next.next = next;
                    }
                }

                // Return an iterator with no values.
                return { next: doneResult };
            }
            exports.values = values;

            function doneResult() {
                return { value: undefined$1, done: true };
            }

            Context.prototype = {
                constructor: Context,

                reset: function(skipTempReset) {
                    this.prev = 0;
                    this.next = 0;
                    // Resetting context._sent for legacy support of Babel's
                    // function.sent implementation.
                    this.sent = this._sent = undefined$1;
                    this.done = false;
                    this.delegate = null;

                    this.method = "next";
                    this.arg = undefined$1;

                    this.tryEntries.forEach(resetTryEntry);

                    if (!skipTempReset) {
                        for (var name in this) {
                            // Not sure about the optimal order of these conditions:
                            if (name.charAt(0) === "t" &&
                                hasOwn.call(this, name) &&
                                !isNaN(+name.slice(1))) {
                                this[name] = undefined$1;
                            }
                        }
                    }
                },

                stop: function() {
                    this.done = true;

                    var rootEntry = this.tryEntries[0];
                    var rootRecord = rootEntry.completion;
                    if (rootRecord.type === "throw") {
                        throw rootRecord.arg;
                    }

                    return this.rval;
                },

                dispatchException: function(exception) {
                    if (this.done) {
                        throw exception;
                    }

                    var context = this;
                    function handle(loc, caught) {
                        record.type = "throw";
                        record.arg = exception;
                        context.next = loc;

                        if (caught) {
                            // If the dispatched exception was caught by a catch block,
                            // then let that catch block handle the exception normally.
                            context.method = "next";
                            context.arg = undefined$1;
                        }

                        return !! caught;
                    }

                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        var record = entry.completion;

                        if (entry.tryLoc === "root") {
                            // Exception thrown outside of any try block that could handle
                            // it, so set the completion value of the entire function to
                            // throw the exception.
                            return handle("end");
                        }

                        if (entry.tryLoc <= this.prev) {
                            var hasCatch = hasOwn.call(entry, "catchLoc");
                            var hasFinally = hasOwn.call(entry, "finallyLoc");

                            if (hasCatch && hasFinally) {
                                if (this.prev < entry.catchLoc) {
                                    return handle(entry.catchLoc, true);
                                } else if (this.prev < entry.finallyLoc) {
                                    return handle(entry.finallyLoc);
                                }

                            } else if (hasCatch) {
                                if (this.prev < entry.catchLoc) {
                                    return handle(entry.catchLoc, true);
                                }

                            } else if (hasFinally) {
                                if (this.prev < entry.finallyLoc) {
                                    return handle(entry.finallyLoc);
                                }

                            } else {
                                throw new Error("try statement without catch or finally");
                            }
                        }
                    }
                },

                abrupt: function(type, arg) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.tryLoc <= this.prev &&
                            hasOwn.call(entry, "finallyLoc") &&
                            this.prev < entry.finallyLoc) {
                            var finallyEntry = entry;
                            break;
                        }
                    }

                    if (finallyEntry &&
                        (type === "break" ||
                            type === "continue") &&
                        finallyEntry.tryLoc <= arg &&
                        arg <= finallyEntry.finallyLoc) {
                        // Ignore the finally entry if control is not jumping to a
                        // location outside the try/catch block.
                        finallyEntry = null;
                    }

                    var record = finallyEntry ? finallyEntry.completion : {};
                    record.type = type;
                    record.arg = arg;

                    if (finallyEntry) {
                        this.method = "next";
                        this.next = finallyEntry.finallyLoc;
                        return ContinueSentinel;
                    }

                    return this.complete(record);
                },

                complete: function(record, afterLoc) {
                    if (record.type === "throw") {
                        throw record.arg;
                    }

                    if (record.type === "break" ||
                        record.type === "continue") {
                        this.next = record.arg;
                    } else if (record.type === "return") {
                        this.rval = this.arg = record.arg;
                        this.method = "return";
                        this.next = "end";
                    } else if (record.type === "normal" && afterLoc) {
                        this.next = afterLoc;
                    }

                    return ContinueSentinel;
                },

                finish: function(finallyLoc) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.finallyLoc === finallyLoc) {
                            this.complete(entry.completion, entry.afterLoc);
                            resetTryEntry(entry);
                            return ContinueSentinel;
                        }
                    }
                },

                "catch": function(tryLoc) {
                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                        var entry = this.tryEntries[i];
                        if (entry.tryLoc === tryLoc) {
                            var record = entry.completion;
                            if (record.type === "throw") {
                                var thrown = record.arg;
                                resetTryEntry(entry);
                            }
                            return thrown;
                        }
                    }

                    // The context.catch method must only be called with a location
                    // argument that corresponds to a known catch block.
                    throw new Error("illegal catch attempt");
                },

                delegateYield: function(iterable, resultName, nextLoc) {
                    this.delegate = {
                        iterator: values(iterable),
                        resultName: resultName,
                        nextLoc: nextLoc
                    };

                    if (this.method === "next") {
                        // Deliberately forget the last sent value so that we don't
                        // accidentally pass it on to the delegate.
                        this.arg = undefined$1;
                    }

                    return ContinueSentinel;
                }
            };

            // Regardless of whether this script is executing as a CommonJS module
            // or not, return the runtime object so that we can declare the variable
            // regeneratorRuntime in the outer scope, which allows this module to be
            // injected easily by `bin/regenerator --include-runtime script.js`.
            return exports;

        }(
            // If this script is executing as a CommonJS module, use module.exports
            // as the regeneratorRuntime namespace. Otherwise create a new empty
            // object. Either way, the resulting object will be used to initialize
            // the regeneratorRuntime variable at the top of this file.
            module.exports
        ));

        try {
            regeneratorRuntime = runtime;
        } catch (accidentalStrictMode) {
            // This module should not be running in strict mode, so the above
            // assignment should always work unless something is misconfigured. Just
            // in case runtime.js accidentally runs in strict mode, we can escape
            // strict mode using a global Function call. This could conceivably fail
            // if a Content Security Policy forbids using Function, but in that case
            // the proper solution is to fix the accidental strict mode problem. If
            // you've misconfigured your bundler to force strict mode and applied a
            // CSP to forbid Function, and you're not willing to fix either of those
            // problems, please detail your unique predicament in a GitHub issue.
            Function("r", "regeneratorRuntime = r")(runtime);
        }
    });

    var regenerator = runtime_1;

    function decodeBase64(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICd1c2Ugc3RyaWN0JzsKCiAgZnVuY3Rpb24gX3R5cGVvZihvYmopIHsKICAgICJAYmFiZWwvaGVscGVycyAtIHR5cGVvZiI7CgogICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICJmdW5jdGlvbiIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gInN5bWJvbCIpIHsKICAgICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7CiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7CiAgICAgIH07CiAgICB9IGVsc2UgewogICAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsKICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09ICJmdW5jdGlvbiIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gInN5bWJvbCIgOiB0eXBlb2Ygb2JqOwogICAgICB9OwogICAgfQoKICAgIHJldHVybiBfdHlwZW9mKG9iaik7CiAgfQoKICBmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7CiAgICB0cnkgewogICAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7CiAgICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7CiAgICB9IGNhdGNoIChlcnJvcikgewogICAgICByZWplY3QoZXJyb3IpOwogICAgICByZXR1cm47CiAgICB9CgogICAgaWYgKGluZm8uZG9uZSkgewogICAgICByZXNvbHZlKHZhbHVlKTsKICAgIH0gZWxzZSB7CiAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTsKICAgIH0KICB9CgogIGZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7CiAgICByZXR1cm4gZnVuY3Rpb24gKCkgewogICAgICB2YXIgc2VsZiA9IHRoaXMsCiAgICAgICAgICBhcmdzID0gYXJndW1lbnRzOwogICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgewogICAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTsKCiAgICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHsKICAgICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgIm5leHQiLCB2YWx1ZSk7CiAgICAgICAgfQoKICAgICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7CiAgICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csICJ0aHJvdyIsIGVycik7CiAgICAgICAgfQoKICAgICAgICBfbmV4dCh1bmRlZmluZWQpOwogICAgICB9KTsKICAgIH07CiAgfQoKICBmdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbikgewogICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfTsKICAJcmV0dXJuIGZuKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMpLCBtb2R1bGUuZXhwb3J0czsKICB9CgogIC8qKgogICAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLgogICAqCiAgICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlCiAgICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLgogICAqLwoKICB2YXIgcnVudGltZV8xID0gY3JlYXRlQ29tbW9uanNNb2R1bGUoZnVuY3Rpb24gKG1vZHVsZSkgewogIHZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7CgogICAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTsKICAgIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTsKICAgIHZhciB1bmRlZmluZWQkMTsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuCiAgICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICJmdW5jdGlvbiIgPyBTeW1ib2wgOiB7fTsKICAgIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgIkBAaXRlcmF0b3IiOwogICAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgIkBAYXN5bmNJdGVyYXRvciI7CiAgICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8ICJAQHRvU3RyaW5nVGFnIjsKCiAgICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7CiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgewogICAgICAgIHZhbHVlOiB2YWx1ZSwKICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLAogICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSwKICAgICAgICB3cml0YWJsZTogdHJ1ZQogICAgICB9KTsKICAgICAgcmV0dXJuIG9ialtrZXldOwogICAgfQogICAgdHJ5IHsKICAgICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy4KICAgICAgZGVmaW5lKHt9LCAiIik7CiAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgZGVmaW5lID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7CiAgICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7CiAgICAgIH07CiAgICB9CgogICAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkgewogICAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci4KICAgICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7CiAgICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7CiAgICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pOwoKICAgICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LAogICAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuCiAgICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTsKCiAgICAgIHJldHVybiBnZW5lcmF0b3I7CiAgICB9CiAgICBleHBvcnRzLndyYXAgPSB3cmFwOwoKICAgIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvbgogICAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkCiAgICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmUKICAgIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2UKICAgIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWQKICAgIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmcKICAgIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlCiAgICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGUKICAgIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2gKICAgIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS4KICAgIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykgewogICAgICB0cnkgewogICAgICAgIHJldHVybiB7IHR5cGU6ICJub3JtYWwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07CiAgICAgIH0gY2F0Y2ggKGVycikgewogICAgICAgIHJldHVybiB7IHR5cGU6ICJ0aHJvdyIsIGFyZzogZXJyIH07CiAgICAgIH0KICAgIH0KCiAgICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9ICJzdXNwZW5kZWRTdGFydCI7CiAgICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9ICJzdXNwZW5kZWRZaWVsZCI7CiAgICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSAiZXhlY3V0aW5nIjsKICAgIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9ICJjb21wbGV0ZWQiOwoKICAgIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXMKICAgIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC4KICAgIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307CgogICAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kCiAgICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3IKICAgIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyCiAgICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLgogICAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge30KICAgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge30KICAgIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge30KCiAgICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0CiAgICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LgogICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307CiAgICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7CiAgICAgIHJldHVybiB0aGlzOwogICAgfTsKCiAgICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7CiAgICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7CiAgICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiYKICAgICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiYKICAgICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7CiAgICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkCiAgICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC4KICAgICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTsKICAgIH0KCiAgICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPQogICAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7CiAgICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlOwogICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjsKICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKAogICAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwKICAgICAgdG9TdHJpbmdUYWdTeW1ib2wsCiAgICAgICJHZW5lcmF0b3JGdW5jdGlvbiIKICAgICk7CgogICAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGUKICAgIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuCiAgICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7CiAgICAgIFsibmV4dCIsICJ0aHJvdyIsICJyZXR1cm4iXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkgewogICAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTsKICAgICAgICB9KTsKICAgICAgfSk7CiAgICB9CgogICAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7CiAgICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gImZ1bmN0aW9uIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7CiAgICAgIHJldHVybiBjdG9yCiAgICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fAogICAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhbgogICAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LgogICAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gIkdlbmVyYXRvckZ1bmN0aW9uIgogICAgICAgIDogZmFsc2U7CiAgICB9OwoKICAgIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikgewogICAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7CiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpOwogICAgICB9IGVsc2UgewogICAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTsKICAgICAgICBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgIkdlbmVyYXRvckZ1bmN0aW9uIik7CiAgICAgIH0KICAgICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApOwogICAgICByZXR1cm4gZ2VuRnVuOwogICAgfTsKCiAgICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG8KICAgIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0CiAgICAvLyBgaGFzT3duLmNhbGwodmFsdWUsICJfX2F3YWl0IilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpcwogICAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4KICAgIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHsKICAgICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07CiAgICB9OwoKICAgIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkgewogICAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkgewogICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpOwogICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gInRocm93IikgewogICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZzsKICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTsKICAgICAgICAgIGlmICh2YWx1ZSAmJgogICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gIm9iamVjdCIgJiYKICAgICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgIl9fYXdhaXQiKSkgewogICAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7CiAgICAgICAgICAgICAgaW52b2tlKCJuZXh0IiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7CiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikgewogICAgICAgICAgICAgIGludm9rZSgidGhyb3ciLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7CiAgICAgICAgICAgIH0pOwogICAgICAgICAgfQoKICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkgewogICAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lcwogICAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGUKICAgICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uCiAgICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDsKICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpOwogICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHsKICAgICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2sKICAgICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLgogICAgICAgICAgICByZXR1cm4gaW52b2tlKCJ0aHJvdyIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpOwogICAgICAgICAgfSk7CiAgICAgICAgfQogICAgICB9CgogICAgICB2YXIgcHJldmlvdXNQcm9taXNlOwoKICAgICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykgewogICAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkgewogICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsKICAgICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpOwogICAgICAgICAgfSk7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID0KICAgICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWwKICAgICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLAogICAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZgogICAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG8KICAgICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLAogICAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG8KICAgICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHkKICAgICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzCiAgICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseQogICAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGUKICAgICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5CiAgICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuCiAgICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbigKICAgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsCiAgICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyCiAgICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci4KICAgICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcKICAgICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpOwogICAgICB9CgogICAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LAogICAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS4KICAgICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTsKICAgIH0KCiAgICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpOwogICAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7CiAgICAgIHJldHVybiB0aGlzOwogICAgfTsKICAgIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7CgogICAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZgogICAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mCiAgICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci4KICAgIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHsKICAgICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTsKCiAgICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoCiAgICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksCiAgICAgICAgUHJvbWlzZUltcGwKICAgICAgKTsKCiAgICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbikKICAgICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLgogICAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHsKICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7CiAgICAgICAgICB9KTsKICAgIH07CgogICAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7CiAgICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7CgogICAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7CiAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykgewogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nIik7CiAgICAgICAgfQoKICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7CiAgICAgICAgICBpZiAobWV0aG9kID09PSAidGhyb3ciKSB7CiAgICAgICAgICAgIHRocm93IGFyZzsKICAgICAgICAgIH0KCiAgICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOgogICAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZQogICAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTsKICAgICAgICB9CgogICAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kOwogICAgICAgIGNvbnRleHQuYXJnID0gYXJnOwoKICAgICAgICB3aGlsZSAodHJ1ZSkgewogICAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTsKICAgICAgICAgIGlmIChkZWxlZ2F0ZSkgewogICAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTsKICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7CiAgICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTsKICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09ICJuZXh0IikgewogICAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3MKICAgICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi4KICAgICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnOwoKICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09ICJ0aHJvdyIpIHsKICAgICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7CiAgICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDsKICAgICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZzsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7CgogICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gInJldHVybiIpIHsKICAgICAgICAgICAgY29udGV4dC5hYnJ1cHQoInJldHVybiIsIGNvbnRleHQuYXJnKTsKICAgICAgICAgIH0KCiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nOwoKICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTsKICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gIm5vcm1hbCIpIHsKICAgICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PQogICAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uCiAgICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lCiAgICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZAogICAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDsKCiAgICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7CiAgICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIHJldHVybiB7CiAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsCiAgICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lCiAgICAgICAgICAgIH07CgogICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gInRocm93IikgewogICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkOwogICAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlCiAgICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuCiAgICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gInRocm93IjsKICAgICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfTsKICAgIH0KCiAgICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGUKICAgIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGUKICAgIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLAogICAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuCiAgICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7CiAgICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07CiAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCQxKSB7CiAgICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93CiAgICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC4KICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDsKCiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSAidGhyb3ciKSB7CiAgICAgICAgICAvLyBOb3RlOiBbInJldHVybiJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS4KICAgICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvclsicmV0dXJuIl0pIHsKICAgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYQogICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuCiAgICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gInJldHVybiI7CiAgICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkJDE7CiAgICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpOwoKICAgICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSAidGhyb3ciKSB7CiAgICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb20KICAgICAgICAgICAgICAvLyAicmV0dXJuIiB0byAidGhyb3ciLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LgogICAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsOwogICAgICAgICAgICB9CiAgICAgICAgICB9CgogICAgICAgICAgY29udGV4dC5tZXRob2QgPSAidGhyb3ciOwogICAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKAogICAgICAgICAgICAiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZCIpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7CiAgICAgIH0KCiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7CgogICAgICBpZiAocmVjb3JkLnR5cGUgPT09ICJ0aHJvdyIpIHsKICAgICAgICBjb250ZXh0Lm1ldGhvZCA9ICJ0aHJvdyI7CiAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnOwogICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsOwogICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsOwogICAgICB9CgogICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7CgogICAgICBpZiAoISBpbmZvKSB7CiAgICAgICAgY29udGV4dC5tZXRob2QgPSAidGhyb3ciOwogICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcigiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3QiKTsKICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDsKICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDsKICAgICAgfQoKICAgICAgaWYgKGluZm8uZG9uZSkgewogICAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5CiAgICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS4KICAgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTsKCiAgICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLgogICAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7CgogICAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyAidGhyb3ciIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGUKICAgICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmCiAgICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzICJuZXh0IiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuCiAgICAgICAgLy8gImNvbnN1bWVkIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhcwogICAgICAgIC8vICJyZXR1cm4iLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZQogICAgICAgIC8vIG91dGVyIGdlbmVyYXRvci4KICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09ICJyZXR1cm4iKSB7CiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9ICJuZXh0IjsKICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkJDE7CiAgICAgICAgfQoKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuCiAgICAgICAgcmV0dXJuIGluZm87CiAgICAgIH0KCiAgICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoCiAgICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuCiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsOwogICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDsKICAgIH0KCiAgICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZQogICAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLgogICAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTsKCiAgICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCAiR2VuZXJhdG9yIik7CgogICAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGUKICAgIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlCiAgICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvcgogICAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uCiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy4KICAgIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpczsKICAgIH07CgogICAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuICJbb2JqZWN0IEdlbmVyYXRvcl0iOwogICAgfTsKCiAgICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykgewogICAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9OwoKICAgICAgaWYgKDEgaW4gbG9jcykgewogICAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTsKICAgICAgfQoKICAgICAgaWYgKDIgaW4gbG9jcykgewogICAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdOwogICAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTsKICAgICAgfQoKICAgICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpOwogICAgfQoKICAgIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHsKICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307CiAgICAgIHJlY29yZC50eXBlID0gIm5vcm1hbCI7CiAgICAgIGRlbGV0ZSByZWNvcmQuYXJnOwogICAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkOwogICAgfQoKICAgIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHsKICAgICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoCiAgICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb20KICAgICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LgogICAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6ICJyb290IiB9XTsKICAgICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpOwogICAgICB0aGlzLnJlc2V0KHRydWUpOwogICAgfQoKICAgIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkgewogICAgICB2YXIga2V5cyA9IFtdOwogICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7CiAgICAgICAga2V5cy5wdXNoKGtleSk7CiAgICAgIH0KICAgICAga2V5cy5yZXZlcnNlKCk7CgogICAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcAogICAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLgogICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHsKICAgICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHsKICAgICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpOwogICAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHsKICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTsKICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7CiAgICAgICAgICAgIHJldHVybiBuZXh0OwogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlCiAgICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXMKICAgICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi4KICAgICAgICBuZXh0LmRvbmUgPSB0cnVlOwogICAgICAgIHJldHVybiBuZXh0OwogICAgICB9OwogICAgfTsKCiAgICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHsKICAgICAgaWYgKGl0ZXJhYmxlKSB7CiAgICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdOwogICAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkgewogICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpOwogICAgICAgIH0KCiAgICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSAiZnVuY3Rpb24iKSB7CiAgICAgICAgICByZXR1cm4gaXRlcmFibGU7CiAgICAgICAgfQoKICAgICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHsKICAgICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkgewogICAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7CiAgICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkgewogICAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldOwogICAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7CiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dDsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQkMTsKICAgICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTsKCiAgICAgICAgICAgIHJldHVybiBuZXh0OwogICAgICAgICAgfTsKCiAgICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy4KICAgICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9OwogICAgfQogICAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7CgogICAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHsKICAgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCQxLCBkb25lOiB0cnVlIH07CiAgICB9CgogICAgQ29udGV4dC5wcm90b3R5cGUgPSB7CiAgICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LAoKICAgICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHsKICAgICAgICB0aGlzLnByZXYgPSAwOwogICAgICAgIHRoaXMubmV4dCA9IDA7CiAgICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3MKICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLgogICAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQkMTsKICAgICAgICB0aGlzLmRvbmUgPSBmYWxzZTsKICAgICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDsKCiAgICAgICAgdGhpcy5tZXRob2QgPSAibmV4dCI7CiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQkMTsKCiAgICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7CgogICAgICAgIGlmICghc2tpcFRlbXBSZXNldCkgewogICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7CiAgICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6CiAgICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gInQiICYmCiAgICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJgogICAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkgewogICAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQkMTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSwKCiAgICAgIHN0b3A6IGZ1bmN0aW9uKCkgewogICAgICAgIHRoaXMuZG9uZSA9IHRydWU7CgogICAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07CiAgICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjsKICAgICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSAidGhyb3ciKSB7CiAgICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZzsKICAgICAgICB9CgogICAgICAgIHJldHVybiB0aGlzLnJ2YWw7CiAgICAgIH0sCgogICAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7CiAgICAgICAgaWYgKHRoaXMuZG9uZSkgewogICAgICAgICAgdGhyb3cgZXhjZXB0aW9uOwogICAgICAgIH0KCiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzOwogICAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkgewogICAgICAgICAgcmVjb3JkLnR5cGUgPSAidGhyb3ciOwogICAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjsKICAgICAgICAgIGNvbnRleHQubmV4dCA9IGxvYzsKCiAgICAgICAgICBpZiAoY2F1Z2h0KSB7CiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssCiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuCiAgICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gIm5leHQiOwogICAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZCQxOwogICAgICAgICAgfQoKICAgICAgICAgIHJldHVybiAhISBjYXVnaHQ7CiAgICAgICAgfQoKICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7CiAgICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07CiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjsKCiAgICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSAicm9vdCIpIHsKICAgICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGUKICAgICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvCiAgICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uCiAgICAgICAgICAgIHJldHVybiBoYW5kbGUoImVuZCIpOwogICAgICAgICAgfQoKICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7CiAgICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCAiY2F0Y2hMb2MiKTsKICAgICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgImZpbmFsbHlMb2MiKTsKCiAgICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7CiAgICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTsKICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHsKICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkgewogICAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykgewogICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7CiAgICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHsKICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5Iik7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0sCgogICAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykgewogICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHsKICAgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTsKICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmCiAgICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksICJmaW5hbGx5TG9jIikgJiYKICAgICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7CiAgICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAoZmluYWxseUVudHJ5ICYmCiAgICAgICAgICAgICh0eXBlID09PSAiYnJlYWsiIHx8CiAgICAgICAgICAgICB0eXBlID09PSAiY29udGludWUiKSAmJgogICAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJgogICAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHsKICAgICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGEKICAgICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay4KICAgICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7CiAgICAgICAgfQoKICAgICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTsKICAgICAgICByZWNvcmQudHlwZSA9IHR5cGU7CiAgICAgICAgcmVjb3JkLmFyZyA9IGFyZzsKCiAgICAgICAgaWYgKGZpbmFsbHlFbnRyeSkgewogICAgICAgICAgdGhpcy5tZXRob2QgPSAibmV4dCI7CiAgICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYzsKICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTsKICAgICAgfSwKCiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7CiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSAidGhyb3ciKSB7CiAgICAgICAgICB0aHJvdyByZWNvcmQuYXJnOwogICAgICAgIH0KCiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSAiYnJlYWsiIHx8CiAgICAgICAgICAgIHJlY29yZC50eXBlID09PSAiY29udGludWUiKSB7CiAgICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnOwogICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09ICJyZXR1cm4iKSB7CiAgICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7CiAgICAgICAgICB0aGlzLm1ldGhvZCA9ICJyZXR1cm4iOwogICAgICAgICAgdGhpcy5uZXh0ID0gImVuZCI7CiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gIm5vcm1hbCIgJiYgYWZ0ZXJMb2MpIHsKICAgICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7CiAgICAgIH0sCgogICAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHsKICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7CiAgICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07CiAgICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykgewogICAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTsKICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7CiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSwKCiAgICAgICJjYXRjaCI6IGZ1bmN0aW9uKHRyeUxvYykgewogICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHsKICAgICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTsKICAgICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykgewogICAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjsKICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSAidGhyb3ciKSB7CiAgICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7CiAgICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgcmV0dXJuIHRocm93bjsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvbgogICAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay4KICAgICAgICB0aHJvdyBuZXcgRXJyb3IoImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdCIpOwogICAgICB9LAoKICAgICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHsKICAgICAgICB0aGlzLmRlbGVnYXRlID0gewogICAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksCiAgICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLAogICAgICAgICAgbmV4dExvYzogbmV4dExvYwogICAgICAgIH07CgogICAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gIm5leHQiKSB7CiAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndAogICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLgogICAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQkMTsKICAgICAgICB9CgogICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsOwogICAgICB9CiAgICB9OwoKICAgIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUKICAgIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZQogICAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlCiAgICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLgogICAgcmV0dXJuIGV4cG9ydHM7CgogIH0oCiAgICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0cwogICAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHkKICAgIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemUKICAgIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuCiAgICBtb2R1bGUuZXhwb3J0cyAKICApKTsKCiAgdHJ5IHsKICAgIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7CiAgfSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHsKICAgIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlCiAgICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3QKICAgIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZQogICAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsCiAgICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2UKICAgIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmCiAgICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYQogICAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlCiAgICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS4KICAgIEZ1bmN0aW9uKCJyIiwgInJlZ2VuZXJhdG9yUnVudGltZSA9IHIiKShydW50aW1lKTsKICB9CiAgfSk7CgogIHZhciByZWdlbmVyYXRvciA9IHJ1bnRpbWVfMTsKCiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgewogICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsKICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uIik7CiAgICB9CiAgfQoKICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7CiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7CiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07CiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsKICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOwogICAgICBpZiAoInZhbHVlIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsKICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOwogICAgfQogIH0KCiAgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgewogICAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7CiAgICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7CiAgICByZXR1cm4gQ29uc3RydWN0b3I7CiAgfQoKICB2YXIgV0FTTV9CQVNFNjQgPSAnQUdGemJRRUFBQUFCeHdFYllBSi9md0YvWUFOL2YzOEJmMkFCZndGL1lBUi9mMzkvQVg5Z0JYOS9mMzkvQVg5Z0FYOEFZQUFBWUFWL2YzOStmd0YvWUFOL2ZuOEJmbUFHZjM5L2YzOS9BWDlnQTM5K2ZnRi9ZQVIvZm41L0FYOWdBQUYvWUFKL2Z3QmdBbjkrQVg5Z0EzOStmd0YvWUFSL2ZuOS9BWDlnQVgwQmZXQUJmQUY5WUFKOGZ3RjhZQU4vZjM4QVlBZC9mMzkvZjM5L0FYOWdDWDkvZjM5L2ZuNS9md0YvWUFkL2YzOS9mbjUvQVg5Z0NIOS9mMzkrZm45L0FYOWdCbjkvZjM1K2Z3Ri9ZQUo5ZndGL0F2QU5Md05sYm5ZVGNIWmZZMjl1YzI5c1pWOXNiMmRmZDJGemJRQUZGbmRoYzJsZmMyNWhjSE5vYjNSZmNISmxkbWxsZHpFSVlYSm5jMTluWlhRQUFCWjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4RG1GeVozTmZjMmw2WlhOZloyVjBBQUFXZDJGemFWOXpibUZ3YzJodmRGOXdjbVYyYVdWM01RdGxiblpwY205dVgyZGxkQUFBRm5kaGMybGZjMjVoY0hOb2IzUmZjSEpsZG1sbGR6RVJaVzUyYVhKdmJsOXphWHBsYzE5blpYUUFBQlozWVhOcFgzTnVZWEJ6YUc5MFgzQnlaWFpwWlhjeERXTnNiMk5yWDNKbGMxOW5aWFFBQUJaM1lYTnBYM051WVhCemFHOTBYM0J5WlhacFpYY3hEbU5zYjJOclgzUnBiV1ZmWjJWMEFBOFdkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVFsbVpGOWhaSFpwYzJVQUN4WjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4QzJaa1gyRnNiRzlqWVhSbEFBb1dkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVFobVpGOWpiRzl6WlFBQ0ZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVMWm1SZlpHRjBZWE41Ym1NQUFoWjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4RFdaa1gyWmtjM1JoZEY5blpYUUFBQlozWVhOcFgzTnVZWEJ6YUc5MFgzQnlaWFpwWlhjeEUyWmtYMlprYzNSaGRGOXpaWFJmWm14aFozTUFBQlozWVhOcFgzTnVZWEJ6YUc5MFgzQnlaWFpwWlhjeEZHWmtYMlprYzNSaGRGOXpaWFJmY21sbmFIUnpBQW9XZDJGemFWOXpibUZ3YzJodmRGOXdjbVYyYVdWM01ROW1aRjltYVd4bGMzUmhkRjluWlhRQUFCWjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4Rkdaa1gyWnBiR1Z6ZEdGMFgzTmxkRjl6YVhwbEFBNFdkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVJWbVpGOW1hV3hsYzNSaGRGOXpaWFJmZEdsdFpYTUFDeFozWVhOcFgzTnVZWEJ6YUc5MFgzQnlaWFpwWlhjeENHWmtYM0J5WldGa0FBY1dkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVE1bVpGOXdjbVZ6ZEdGMFgyZGxkQUFBRm5kaGMybGZjMjVoY0hOb2IzUmZjSEpsZG1sbGR6RVRabVJmY0hKbGMzUmhkRjlrYVhKZmJtRnRaUUFCRm5kaGMybGZjMjVoY0hOb2IzUmZjSEpsZG1sbGR6RUpabVJmY0hkeWFYUmxBQWNXZDJGemFWOXpibUZ3YzJodmRGOXdjbVYyYVdWM01RZG1aRjl5WldGa0FBTVdkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVFwbVpGOXlaV0ZrWkdseUFBY1dkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVF0bVpGOXlaVzUxYldKbGNnQUFGbmRoYzJsZmMyNWhjSE5vYjNSZmNISmxkbWxsZHpFSFptUmZjMlZsYXdBUUZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVIWm1SZmMzbHVZd0FDRm5kaGMybGZjMjVoY0hOb2IzUmZjSEpsZG1sbGR6RUhabVJmZEdWc2JBQUFGbmRoYzJsZmMyNWhjSE5vYjNSZmNISmxkbWxsZHpFSVptUmZkM0pwZEdVQUF4WjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4RlhCaGRHaGZZM0psWVhSbFgyUnBjbVZqZEc5eWVRQUJGbmRoYzJsZmMyNWhjSE5vYjNSZmNISmxkbWxsZHpFUmNHRjBhRjltYVd4bGMzUmhkRjluWlhRQUJCWjNZWE5wWDNOdVlYQnphRzkwWDNCeVpYWnBaWGN4RjNCaGRHaGZabWxzWlhOMFlYUmZjMlYwWDNScGJXVnpBQmNXZDJGemFWOXpibUZ3YzJodmRGOXdjbVYyYVdWM01RbHdZWFJvWDJ4cGJtc0FGUlozWVhOcFgzTnVZWEJ6YUc5MFgzQnlaWFpwWlhjeENYQmhkR2hmYjNCbGJnQVdGbmRoYzJsZmMyNWhjSE5vYjNSZmNISmxkbWxsZHpFTmNHRjBhRjl5WldGa2JHbHVhd0FKRm5kaGMybGZjMjVoY0hOb2IzUmZjSEpsZG1sbGR6RVZjR0YwYUY5eVpXMXZkbVZmWkdseVpXTjBiM0o1QUFFV2QyRnphVjl6Ym1Gd2MyaHZkRjl3Y21WMmFXVjNNUXR3WVhSb1gzSmxibUZ0WlFBSkZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVNY0dGMGFGOXplVzFzYVc1ckFBUVdkMkZ6YVY5emJtRndjMmh2ZEY5d2NtVjJhV1YzTVJCd1lYUm9YM1Z1YkdsdWExOW1hV3hsQUFFV2QyRnphVjl6Ym1Gd2MyaHZkRjl3Y21WMmFXVjNNUXR3YjJ4c1gyOXVaVzltWmdBREZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVKY0hKdlkxOWxlR2wwQUFVV2QyRnphVjl6Ym1Gd2MyaHZkRjl3Y21WMmFXVjNNUXB3Y205algzSmhhWE5sQUFJV2QyRnphVjl6Ym1Gd2MyaHZkRjl3Y21WMmFXVjNNUXR6WTJobFpGOTVhV1ZzWkFBTUZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVLY21GdVpHOXRYMmRsZEFBQUZuZGhjMmxmYzI1aGNITm9iM1JmY0hKbGRtbGxkekVKYzI5amExOXlaV04yQUFrV2QyRnphVjl6Ym1Gd2MyaHZkRjl3Y21WMmFXVjNNUWx6YjJOclgzTmxibVFBQkJaM1lYTnBYM051WVhCemFHOTBYM0J5WlhacFpYY3hEWE52WTJ0ZmMyaDFkR1J2ZDI0QUFBTmxibllHYldWdGIzSjVBZ0FDQTJ0cUJnSUNCUVVBQUEwQkFBQUNBZ1lEQVF3R0FnWUJBd0FDQUFBQUFBQVBDd29DQWdBQUNnQU9Dd2NBQVFjREJ3QVFBZ0FEQUFNWkJCZ0VBQU1CQUFNRkFnd0FDUVFBQVFFSUNBQUJCQlFDQWdFQUFRSUJBQUlBQVJNU0VoTUVHaEVSQVFNRkF3QUFCUTBHQmdRRkFYQUJCUVVHY3hOL0FVSGd0Z1FMZndCQjRMWUVDMzhBUVpRMkMzOEFRYUEyQzM4QVFhUTJDMzhBUWFnMkMzOEFRY1EyQzM4QVFhQTJDMzhBUWFRMkMzOEFRWncyQzM4QVFiQXhDMzhBUWF3VkMzOEFRYUF5QzM4QVFadzJDMzhBUVlBSUMzOEFRZEUyQzM4QVFZQUlDMzhBUVFBTGZ3QkJBUXNIMHhGL0VWOWZkMkZ6YlY5allXeHNYMk4wYjNKekFDNFRjSFpmWkc5M2JuTmhiWEJzWlhKZmFXNXBkQUNQQVFaallXeHNiMk1BTXhWd2RsOWtiM2R1YzJGdGNHeGxjbDlrWld4bGRHVUFrQUVHYldGc2JHOWpBQzhXY0haZlpHOTNibk5oYlhCc1pYSmZjSEp2WTJWemN3Q1JBVGR3ZGw5a2IzZHVjMkZ0Y0d4bGNsOWpiMjUyWlhKMFgyNTFiVjl6WVcxd2JHVnpYM1J2WDJsdWNIVjBYM05oYlhCc1pWOXlZWFJsQUpJQk9IQjJYMlJ2ZDI1ellXMXdiR1Z5WDJOdmJuWmxjblJmYm5WdFgzTmhiWEJzWlhOZmRHOWZiM1YwY0hWMFgzTmhiWEJzWlY5eVlYUmxBSk1CRkhCMlgyUnZkMjV6WVcxd2JHVnlYM0psYzJWMEFKUUJCR1p5WldVQU1RWndkbDlzYjJjQWxRRUpkbk51Y0hKcGJuUm1BRHdOY0haZmJHOW5YMlZ1WVdKc1pRQ1dBUTV3ZGw5c2IyZGZaR2x6WVdKc1pRQ1hBUVJ6WW5KckFEb0xYMTlvWldGd1gySmhjMlVEQVFWbGNuSnVid01DQm0xbGJYTmxkQUI5QjNKbFlXeHNiMk1BTkFadFpXMWpjSGtBZnc1d2IzTnBlRjl0WlcxaGJHbG5iZ0EyRFdGc2FXZHVaV1JmWVd4c2IyTUFPQkp0WVd4c2IyTmZkWE5oWW14bFgzTnBlbVVBT1ExZlgyeHBZbU5mYldGc2JHOWpBQzhMWDE5c2FXSmpYMlp5WldVQU1RMWZYMnhwWW1OZlkyRnNiRzlqQURNR2QzSnBkR1YyQUhNSFgxOXNjMlZsYXdCMUJXeHpaV1ZyQUhVRlkyeHZjMlVBZXc5ZlgzZGhjMmxmWVhKbmMxOW5aWFFBUmhWZlgzZGhjMmxmWVhKbmMxOXphWHBsYzE5blpYUUFSeEpmWDNkaGMybGZaVzUyYVhKdmJsOW5aWFFBU0JoZlgzZGhjMmxmWlc1MmFYSnZibDl6YVhwbGMxOW5aWFFBU1JSZlgzZGhjMmxmWTJ4dlkydGZjbVZ6WDJkbGRBQktGVjlmZDJGemFWOWpiRzlqYTE5MGFXMWxYMmRsZEFCTEVGOWZkMkZ6YVY5bVpGOWhaSFpwYzJVQVRCSmZYM2RoYzJsZlptUmZZV3hzYjJOaGRHVUFUUTlmWDNkaGMybGZabVJmWTJ4dmMyVUFUaEpmWDNkaGMybGZabVJmWkdGMFlYTjVibU1BVHhSZlgzZGhjMmxmWm1SZlptUnpkR0YwWDJkbGRBQlFHbDlmZDJGemFWOW1aRjltWkhOMFlYUmZjMlYwWDJac1lXZHpBRkViWDE5M1lYTnBYMlprWDJaa2MzUmhkRjl6WlhSZmNtbG5hSFJ6QUZJV1gxOTNZWE5wWDJaa1gyWnBiR1Z6ZEdGMFgyZGxkQUJURzE5ZmQyRnphVjltWkY5bWFXeGxjM1JoZEY5elpYUmZjMmw2WlFCVUhGOWZkMkZ6YVY5bVpGOW1hV3hsYzNSaGRGOXpaWFJmZEdsdFpYTUFWUTlmWDNkaGMybGZabVJmY0hKbFlXUUFWaFZmWDNkaGMybGZabVJmY0hKbGMzUmhkRjluWlhRQVZ4cGZYM2RoYzJsZlptUmZjSEpsYzNSaGRGOWthWEpmYm1GdFpRQllFRjlmZDJGemFWOW1aRjl3ZDNKcGRHVUFXUTVmWDNkaGMybGZabVJmY21WaFpBQmFFVjlmZDJGemFWOW1aRjl5WldGa1pHbHlBRnNTWDE5M1lYTnBYMlprWDNKbGJuVnRZbVZ5QUZ3T1gxOTNZWE5wWDJaa1gzTmxaV3NBWFE1ZlgzZGhjMmxmWm1SZmMzbHVZd0JlRGw5ZmQyRnphVjltWkY5MFpXeHNBRjhQWDE5M1lYTnBYMlprWDNkeWFYUmxBR0FjWDE5M1lYTnBYM0JoZEdoZlkzSmxZWFJsWDJScGNtVmpkRzl5ZVFCaEdGOWZkMkZ6YVY5d1lYUm9YMlpwYkdWemRHRjBYMmRsZEFCaUhsOWZkMkZ6YVY5d1lYUm9YMlpwYkdWemRHRjBYM05sZEY5MGFXMWxjd0JqRUY5ZmQyRnphVjl3WVhSb1gyeHBibXNBWkJCZlgzZGhjMmxmY0dGMGFGOXZjR1Z1QUdVVVgxOTNZWE5wWDNCaGRHaGZjbVZoWkd4cGJtc0FaaHhmWDNkaGMybGZjR0YwYUY5eVpXMXZkbVZmWkdseVpXTjBiM0o1QUdjU1gxOTNZWE5wWDNCaGRHaGZjbVZ1WVcxbEFHZ1RYMTkzWVhOcFgzQmhkR2hmYzNsdGJHbHVhd0JwRjE5ZmQyRnphVjl3WVhSb1gzVnViR2x1YTE5bWFXeGxBR29TWDE5M1lYTnBYM0J2Ykd4ZmIyNWxiMlptQUdzUVgxOTNZWE5wWDNCeWIyTmZaWGhwZEFCc0VWOWZkMkZ6YVY5d2NtOWpYM0poYVhObEFHMFNYMTkzWVhOcFgzTmphR1ZrWDNscFpXeGtBRzRSWDE5M1lYTnBYM0poYm1SdmJWOW5aWFFBYnhCZlgzZGhjMmxmYzI5amExOXlaV04yQUhBUVgxOTNZWE5wWDNOdlkydGZjMlZ1WkFCeEZGOWZkMkZ6YVY5emIyTnJYM05vZFhSa2IzZHVBSElGWVdKdmNuUUFPd3hmWDNOMGNtVnljbTl5WDJ3QVJBaHpkSEpsY25KdmNnQkZDbk4wY21WeWNtOXlYMndBUkF4ZlgzTjBaR2x2WDJWNGFYUUFQd3BmWDNCeWIyZHVZVzFsQXdNUFgxOXdjbTluYm1GdFpWOW1kV3hzQXdRR1gxOXNhV0pqQXdVSFgxOW9kMk5oY0FNR0hYQnliMmR5WVcxZmFXNTJiMk5oZEdsdmJsOXphRzl5ZEY5dVlXMWxBd2NYY0hKdlozSmhiVjlwYm5adlkyRjBhVzl1WDI1aGJXVURDQWxmWDJaM2NtbDBaWGdBUWdabWQzSnBkR1VBUXc5bWQzSnBkR1ZmZFc1c2IyTnJaV1FBUXd4ZlgzTjBaR2x2WDNObFpXc0FkZzFmWDNOMFpHOTFkRjkxYzJWa0F3a0pYMTkwYjNkeWFYUmxBRUFhWDE5MGIzZHlhWFJsWDI1bFpXUnpYM04wWkdsdlgyVjRhWFFBUVFWbWNIVjBjd0IzRG1ad2RYUnpYM1Z1Ykc5amEyVmtBSGNOWDE5emRHUnBiMTkzY21sMFpRQjBEVjlmYzNSa1pYSnlYMFpKVEVVRENnWnpkR1JsY25JREN3MWZYM04wWkdWeWNsOTFjMlZrQXd3SWRtWndjbWx1ZEdZQWVBeGZYM04wWkdsdVgzVnpaV1FERFJOZlgzTjBaR2x2WDJWNGFYUmZibVZsWkdWa0FEOEtYMTl2Wm14ZmJHOWphd0ErREY5ZmIyWnNYM1Z1Ykc5amF3QXVDVjlmYkdOMGNtRnVjd0NDQVFkemRISnViR1Z1QUg0R2QyTjBiMjFpQUlRQkJXWnlaWGh3QUlZQkRWOWZjM1JrYVc5ZlkyeHZjMlVBZkFaemRISnNaVzRBZ0FFSGJXVnRiVzkyWlFDT0FRWnRaVzFqYUhJQWdRRU9YMTlzWTNSeVlXNXpYMmx0Y0d3QWdnRU5YMTlzWTNSeVlXNXpYMk4xY2dDREFRZDNZM0owYjIxaUFJVUJCMTlmWTI5elpHWUFod0VIWDE5emFXNWtaZ0NJQVF0ZlgzSmxiVjl3YVc4eVpnQ0xBUVJqYjNObUFJd0JCSE5wYm1ZQWpRRVFYMTl5WlcxZmNHbHZNbDlzWVhKblpRQ0tBUVp6WTJGc1ltNEFpUUVNWDE5a2MyOWZhR0Z1Wkd4bEF3NEtYMTlrWVhSaFgyVnVaQU1QRFY5ZloyeHZZbUZzWDJKaGMyVURFQTFmWDIxbGJXOXllVjlpWVhObEF4RU1YMTkwWVdKc1pWOWlZWE5sQXhJSkNnRUFRUUVMQkQxOGRIWUt4UHdCYWdNQUFRc0dBQ0FBRURBTHZ6QUJDMzhqQUVFUWF5SUxKQUFDUUVHOE1pZ0NBQTBBUVFBUU9rSGd0Z1JySWdSQjJRQkpEUUJCL0RVb0FnQWlBa1VFUUVHSU5rSi9Od0lBUVlBMlFvQ0FoSUNBZ01BQU53SUFRZncxSUF0QkNHcEJjSEZCMktyVnFnVnpJZ0kyQWdCQmtEWkJBRFlDQUVIZ05VRUFOZ0lBQzBIb05TQUVOZ0lBUWVRMVFlQzJCRFlDQUVHME1rSGd0Z1EyQWdCQnlESWdBallDQUVIRU1rRi9OZ0lBQTBBZ0FVSFVNbW9nQVVITU1tb2lBallDQUNBQlFkZ3lhaUFDTmdJQUlBRkJDR29pQVVHQUFrY05BQXRCQ0NJQlFlUzJCR29nQkNBQmEwRklhaUlDUVFGeU5nSUFRY0F5UVl3MktBSUFOZ0lBUWJ3eUlBRkI0TFlFYWpZQ0FFR3dNaUFDTmdJQUlBUkJyTFlFYWtFNE5nSUFDd0pBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBZ0FFSHNBVTBFUUVHa01pZ0NBQ0lHUVJBZ0FFRVRha0Z3Y1NBQVFRdEpHeUlFUVFOMklnSjJJZ0ZCQTNFRVFDQUJRUUZ4SUFKeVFRRnpJZ1JCQTNRaUEwSFVNbW9vQWdBaUFrRUlhaUVCQWtBZ0FpZ0NDQ0lBSUFOQnpESnFJZ05HQkVCQnBESWdCa0YrSUFSM2NUWUNBQXdCQzBHME1pZ0NBQm9nQXlBQU5nSUlJQUFnQXpZQ0RBc2dBaUFFUVFOMElnQkJBM0kyQWdRZ0FDQUNhaUlDSUFJb0FnUkJBWEkyQWdRTURBc2dCRUdzTWlnQ0FDSUlUUTBCSUFFRVFBSkFJQUVnQW5SQkFpQUNkQ0lCUVFBZ0FXdHljU0lCUVFBZ0FXdHhRWDlxSWdFZ0FVRU1ka0VRY1NJQmRpSUNRUVYyUVFoeElnQWdBWElnQWlBQWRpSUJRUUoyUVFSeElnSnlJQUVnQW5ZaUFVRUJka0VDY1NJQ2NpQUJJQUoySWdGQkFYWkJBWEVpQW5JZ0FTQUNkbW9pQUVFRGRDSURRZFF5YWlnQ0FDSUNLQUlJSWdFZ0EwSE1NbW9pQTBZRVFFR2tNaUFHUVg0Z0FIZHhJZ1kyQWdBTUFRdEJ0RElvQWdBYUlBTWdBVFlDQ0NBQklBTTJBZ3dMSUFKQkNHb2hBU0FDSUFSQkEzSTJBZ1FnQWlBQVFRTjBJZ0JxSUFBZ0JHc2lBRFlDQUNBQ0lBUnFJZ01nQUVFQmNqWUNCQ0FJQkVBZ0NFRURkaUlGUVFOMFFjd3lhaUVFUWJneUtBSUFJUUlDZnlBR1FRRWdCWFFpQlhGRkJFQkJwRElnQlNBR2NqWUNBQ0FFREFFTElBUW9BZ2dMSWdVZ0FqWUNEQ0FFSUFJMkFnZ2dBaUFFTmdJTUlBSWdCVFlDQ0F0QnVESWdBellDQUVHc01pQUFOZ0lBREF3TFFhZ3lLQUlBSWdsRkRRRWdDVUVBSUFscmNVRi9haUlCSUFGQkRIWkJFSEVpQVhZaUFrRUZka0VJY1NJQUlBRnlJQUlnQUhZaUFVRUNka0VFY1NJQ2NpQUJJQUoySWdGQkFYWkJBbkVpQW5JZ0FTQUNkaUlCUVFGMlFRRnhJZ0p5SUFFZ0FuWnFRUUowUWRRMGFpZ0NBQ0lES0FJRVFYaHhJQVJySVFJZ0F5RUFBMEFDUUNBQUtBSVFJZ0ZGQkVBZ0FFRVVhaWdDQUNJQlJRMEJDeUFCS0FJRVFYaHhJQVJySWdBZ0FpQUFJQUpKSWdBYklRSWdBU0FESUFBYklRTWdBU0VBREFFTEN5QURLQUlZSVFvZ0F5QURLQUlNSWdWSEJFQkJ0RElvQWdBZ0F5Z0NDQ0lCVFFSQUlBRW9BZ3dhQ3lBRklBRTJBZ2dnQVNBRk5nSU1EQXNMSUFOQkZHb2lBQ2dDQUNJQlJRUkFJQU1vQWhBaUFVVU5BeUFEUVJCcUlRQUxBMEFnQUNFSElBRWlCVUVVYWlJQUtBSUFJZ0VOQUNBRlFSQnFJUUFnQlNnQ0VDSUJEUUFMSUFkQkFEWUNBQXdLQzBGL0lRUWdBRUcvZjBzTkFDQUFRUk5xSWdGQmNIRWhCRUdvTWlnQ0FDSUlSUTBBQW45QkFDQUJRUWgySWdGRkRRQWFRUjhnQkVILy8vOEhTdzBBR2lBQklBRkJnUDQvYWtFUWRrRUljU0lDZENJQklBRkJnT0FmYWtFUWRrRUVjU0lCZENJQUlBQkJnSUFQYWtFUWRrRUNjU0lBZEVFUGRpQUJJQUp5SUFCeWF5SUJRUUYwSUFRZ0FVRVZhblpCQVhGeVFSeHFDeUVIUVFBZ0JHc2hBQUpBQWtBQ1FDQUhRUUowUWRRMGFpZ0NBQ0lDUlFSQVFRQWhBUXdCQ3lBRVFRQkJHU0FIUVFGMmF5QUhRUjlHRzNRaEEwRUFJUUVEUUFKQUlBSW9BZ1JCZUhFZ0JHc2lCaUFBVHcwQUlBSWhCU0FHSWdBTkFFRUFJUUFnQWlFQkRBTUxJQUVnQWtFVWFpZ0NBQ0lHSUFZZ0FpQURRUjEyUVFSeGFrRVFhaWdDQUNJQ1Joc2dBU0FHR3lFQklBTWdBa0VBUjNRaEF5QUNEUUFMQ3lBQklBVnlSUVJBUVFJZ0IzUWlBVUVBSUFGcmNpQUljU0lCUlEwRElBRkJBQ0FCYTNGQmYyb2lBU0FCUVF4MlFSQnhJZ0YySWdKQkJYWkJDSEVpQXlBQmNpQUNJQU4ySWdGQkFuWkJCSEVpQW5JZ0FTQUNkaUlCUVFGMlFRSnhJZ0p5SUFFZ0FuWWlBVUVCZGtFQmNTSUNjaUFCSUFKMmFrRUNkRUhVTkdvb0FnQWhBUXNnQVVVTkFRc0RRQ0FCS0FJRVFYaHhJQVJySWdZZ0FFa2hBeUFHSUFBZ0F4c2hBQ0FCSUFVZ0F4c2hCU0FCS0FJUUlnSUVmeUFDQlNBQlFSUnFLQUlBQ3lJQkRRQUxDeUFGUlEwQUlBQkJyRElvQWdBZ0JHdFBEUUFnQlNnQ0dDRUhJQVVnQlNnQ0RDSURSd1JBUWJReUtBSUFJQVVvQWdnaUFVMEVRQ0FCS0FJTUdnc2dBeUFCTmdJSUlBRWdBellDREF3SkN5QUZRUlJxSWdJb0FnQWlBVVVFUUNBRktBSVFJZ0ZGRFFNZ0JVRVFhaUVDQ3dOQUlBSWhCaUFCSWdOQkZHb2lBaWdDQUNJQkRRQWdBMEVRYWlFQ0lBTW9BaEFpQVEwQUN5QUdRUUEyQWdBTUNBdEJyRElvQWdBaUFTQUVUd1JBUWJneUtBSUFJUUlDUUNBQklBUnJJZ0JCRUU4RVFDQUNJQVJxSWdNZ0FFRUJjallDQkVHc01pQUFOZ0lBUWJneUlBTTJBZ0FnQVNBQ2FpQUFOZ0lBSUFJZ0JFRURjallDQkF3QkN5QUNJQUZCQTNJMkFnUWdBU0FDYWlJQklBRW9BZ1JCQVhJMkFnUkJ1REpCQURZQ0FFR3NNa0VBTmdJQUN5QUNRUWhxSVFFTUNndEJzRElvQWdBaUF5QUVTd1JBUWJ3eUtBSUFJZ0VnQkdvaUFpQURJQVJySWdCQkFYSTJBZ1JCc0RJZ0FEWUNBRUc4TWlBQ05nSUFJQUVnQkVFRGNqWUNCQ0FCUVFocUlRRU1DZ3RCQUNFQklBUkJ4d0JxSWdnQ2YwSDhOU2dDQUFSQVFZUTJLQUlBREFFTFFZZzJRbjgzQWdCQmdEWkNnSUNFZ0lDQXdBQTNBZ0JCL0RVZ0MwRU1ha0Z3Y1VIWXF0V3FCWE0yQWdCQmtEWkJBRFlDQUVIZ05VRUFOZ0lBUVlDQUJBc2lBbW9pQmtFQUlBSnJJZ2R4SWdVZ0JFMEVRRUdVTmtFd05nSUFEQW9MQWtCQjNEVW9BZ0FpQVVVTkFFSFVOU2dDQUNJQ0lBVnFJZ0FnQWt0QkFDQUFJQUZOR3cwQVFRQWhBVUdVTmtFd05nSUFEQW9MUWVBMUxRQUFRUVJ4RFFRQ1FBSkFRYnd5S0FJQUlnSUVRRUhrTlNFQkEwQWdBU2dDQUNJQUlBSk5CRUFnQUNBQktBSUVhaUFDU3cwREN5QUJLQUlJSWdFTkFBc0xRUUFRT2lJRFFYOUdEUVVnQlNFR1FZQTJLQUlBSWdGQmYyb2lBaUFEY1FSQUlBVWdBMnNnQWlBRGFrRUFJQUZyY1dvaEJnc2dCaUFFVFEwRklBWkIvdi8vL3dkTERRVkIzRFVvQWdBaUFRUkFRZFExS0FJQUlnSWdCbW9pQUNBQ1RRMEdJQUFnQVVzTkJnc2dCaEE2SWdFZ0EwY05BUXdIQ3lBR0lBTnJJQWR4SWdaQi92Ly8vd2RMRFFRZ0JoQTZJZ01nQVNnQ0FDQUJLQUlFYWtZTkF5QURJUUVMSUFFaEF3SkFJQVJCeUFCcUlBWk5EUUFnQmtIKy8vLy9CMHNOQUNBRFFYOUdEUUJCaERZb0FnQWlBU0FJSUFacmFrRUFJQUZyY1NJQlFmNy8vLzhIU3cwR0lBRVFPa0YvUndSQUlBRWdCbW9oQmd3SEMwRUFJQVpyRURvYURBUUxJQU5CZjBjTkJRd0RDMEVBSVFVTUJ3dEJBQ0VEREFVTElBTkJmMGNOQWd0QjREVkI0RFVvQWdCQkJISTJBZ0FMSUFWQi92Ly8vd2RMRFFFZ0JSQTZJZ05CQUJBNklnRlBEUUVnQTBGL1JnMEJJQUZCZjBZTkFTQUJJQU5ySWdZZ0JFRTRhazBOQVF0QjFEVkIxRFVvQWdBZ0Jtb2lBVFlDQUNBQlFkZzFLQUlBU3dSQVFkZzFJQUUyQWdBTEFrQUNRQUpBUWJ3eUtBSUFJZ0lFUUVIa05TRUJBMEFnQXlBQktBSUFJZ0FnQVNnQ0JDSUZha1lOQWlBQktBSUlJZ0VOQUFzTUFndEJ0RElvQWdBaUFVRUFJQU1nQVU4YlJRUkFRYlF5SUFNMkFnQUxRUUFoQVVIb05TQUdOZ0lBUWVRMUlBTTJBZ0JCeERKQmZ6WUNBRUhJTWtIOE5TZ0NBRFlDQUVId05VRUFOZ0lBQTBBZ0FVSFVNbW9nQVVITU1tb2lBallDQUNBQlFkZ3lhaUFDTmdJQUlBRkJDR29pQVVHQUFrY05BQXNnQTBGNElBTnJRUTl4UVFBZ0EwRUlha0VQY1JzaUFXb2lBaUFHUVVocUlnQWdBV3NpQVVFQmNqWUNCRUhBTWtHTU5pZ0NBRFlDQUVHd01pQUJOZ0lBUWJ3eUlBSTJBZ0FnQUNBRGFrRTROZ0lFREFJTElBRXRBQXhCQ0hFTkFDQURJQUpORFFBZ0FDQUNTdzBBSUFKQmVDQUNhMEVQY1VFQUlBSkJDR3BCRDNFYklnQnFJZ05Cc0RJb0FnQWdCbW9pQnlBQWF5SUFRUUZ5TmdJRUlBRWdCU0FHYWpZQ0JFSEFNa0dNTmlnQ0FEWUNBRUd3TWlBQU5nSUFRYnd5SUFNMkFnQWdBaUFIYWtFNE5nSUVEQUVMSUFOQnRESW9BZ0FpQlVrRVFFRzBNaUFETmdJQUlBTWhCUXNnQXlBR2FpRUFRZVExSVFFQ1FBSkFBa0FDUUFKQUFrQURRQ0FBSUFFb0FnQkhCRUFnQVNnQ0NDSUJEUUVNQWdzTElBRXRBQXhCQ0hGRkRRRUxRZVExSVFFRFFDQUJLQUlBSWdBZ0FrMEVRQ0FBSUFFb0FnUnFJZ0FnQWtzTkF3c2dBU2dDQ0NFQkRBQUxBQXNnQVNBRE5nSUFJQUVnQVNnQ0JDQUdhallDQkNBRFFYZ2dBMnRCRDNGQkFDQURRUWhxUVE5eEcyb2lCeUFFUVFOeU5nSUVJQUJCZUNBQWEwRVBjVUVBSUFCQkNHcEJEM0ViYWlJRElBZHJJQVJySVFFZ0JDQUhhaUVBSUFJZ0EwWUVRRUc4TWlBQU5nSUFRYkF5UWJBeUtBSUFJQUZxSWdFMkFnQWdBQ0FCUVFGeU5nSUVEQU1MSUFOQnVESW9BZ0JHQkVCQnVESWdBRFlDQUVHc01rR3NNaWdDQUNBQmFpSUJOZ0lBSUFBZ0FVRUJjallDQkNBQUlBRnFJQUUyQWdBTUF3c2dBeWdDQkNJQ1FRTnhRUUZHQkVBZ0FrRjRjU0VJQWtBZ0FrSC9BVTBFUUNBREtBSUlJZ1lnQWtFRGRpSUpRUU4wUWN3eWFrY2FJQVlnQXlnQ0RDSUVSZ1JBUWFReVFhUXlLQUlBUVg0Z0NYZHhOZ0lBREFJTElBUWdCallDQ0NBR0lBUTJBZ3dNQVFzZ0F5Z0NHQ0VKQWtBZ0F5QURLQUlNSWdaSEJFQWdCU0FES0FJSUlnSk5CRUFnQWlnQ0RCb0xJQVlnQWpZQ0NDQUNJQVkyQWd3TUFRc0NRQ0FEUVJScUlnSW9BZ0FpQkEwQUlBTkJFR29pQWlnQ0FDSUVEUUJCQUNFR0RBRUxBMEFnQWlFRklBUWlCa0VVYWlJQ0tBSUFJZ1FOQUNBR1FSQnFJUUlnQmlnQ0VDSUVEUUFMSUFWQkFEWUNBQXNnQ1VVTkFBSkFJQU1nQXlnQ0hDSUVRUUowUWRRMGFpSUNLQUlBUmdSQUlBSWdCallDQUNBR0RRRkJxREpCcURJb0FnQkJmaUFFZDNFMkFnQU1BZ3NnQ1VFUVFSUWdDU2dDRUNBRFJodHFJQVkyQWdBZ0JrVU5BUXNnQmlBSk5nSVlJQU1vQWhBaUFnUkFJQVlnQWpZQ0VDQUNJQVkyQWhnTElBTW9BaFFpQWtVTkFDQUdRUlJxSUFJMkFnQWdBaUFHTmdJWUN5QURJQWhxSVFNZ0FTQUlhaUVCQ3lBRElBTW9BZ1JCZm5FMkFnUWdBQ0FCYWlBQk5nSUFJQUFnQVVFQmNqWUNCQ0FCUWY4QlRRUkFJQUZCQTNZaUFrRURkRUhNTW1vaEFRSi9RYVF5S0FJQUlnUkJBU0FDZENJQ2NVVUVRRUdrTWlBQ0lBUnlOZ0lBSUFFTUFRc2dBU2dDQ0FzaUFpQUFOZ0lNSUFFZ0FEWUNDQ0FBSUFFMkFnd2dBQ0FDTmdJSURBTUxJQUFDZjBFQUlBRkJDSFlpQkVVTkFCcEJIeUFCUWYvLy93ZExEUUFhSUFRZ0JFR0EvajlxUVJCMlFRaHhJZ0owSWdRZ0JFR0E0QjlxUVJCMlFRUnhJZ1IwSWdNZ0EwR0FnQTlxUVJCMlFRSnhJZ04wUVE5MklBSWdCSElnQTNKcklnSkJBWFFnQVNBQ1FSVnFka0VCY1hKQkhHb0xJZ0kyQWh3Z0FFSUFOd0lRSUFKQkFuUkIxRFJxSVFSQnFESW9BZ0FpQTBFQklBSjBJZ1Z4UlFSQUlBUWdBRFlDQUVHb01pQURJQVZ5TmdJQUlBQWdCRFlDR0NBQUlBQTJBZ2dnQUNBQU5nSU1EQU1MSUFGQkFFRVpJQUpCQVhacklBSkJIMFliZENFQ0lBUW9BZ0FoQXdOQUlBTWlCQ2dDQkVGNGNTQUJSZzBDSUFKQkhYWWhBeUFDUVFGMElRSWdCQ0FEUVFSeGFrRVFhaUlGS0FJQUlnTU5BQXNnQlNBQU5nSUFJQUFnQkRZQ0dDQUFJQUEyQWd3Z0FDQUFOZ0lJREFJTElBTkJlQ0FEYTBFUGNVRUFJQU5CQ0dwQkQzRWJJZ0ZxSWdjZ0JrRklhaUlGSUFGcklnRkJBWEkyQWdRZ0F5QUZha0U0TmdJRUlBSWdBRUUzSUFCclFROXhRUUFnQUVGSmFrRVBjUnRxUVVGcUlnVWdCU0FDUVJCcVNSc2lCVUVqTmdJRVFjQXlRWXcyS0FJQU5nSUFRYkF5SUFFMkFnQkJ2RElnQnpZQ0FDQUZRUkJxUWV3MUtRSUFOd0lBSUFWQjVEVXBBZ0EzQWdoQjdEVWdCVUVJYWpZQ0FFSG9OU0FHTmdJQVFlUTFJQU0yQWdCQjhEVkJBRFlDQUNBRlFTUnFJUUVEUUNBQlFRYzJBZ0FnQUNBQlFRUnFJZ0ZMRFFBTElBSWdCVVlOQXlBRklBVW9BZ1JCZm5FMkFnUWdCU0FGSUFKcklnWTJBZ0FnQWlBR1FRRnlOZ0lFSUFaQi93Rk5CRUFnQmtFRGRpSUFRUU4wUWN3eWFpRUJBbjlCcERJb0FnQWlBMEVCSUFCMElnQnhSUVJBUWFReUlBQWdBM0kyQWdBZ0FRd0JDeUFCS0FJSUN5SUFJQUkyQWd3Z0FTQUNOZ0lJSUFJZ0FUWUNEQ0FDSUFBMkFnZ01CQXNnQWtJQU53SVFJQUpCSEdvQ2YwRUFJQVpCQ0hZaUFFVU5BQnBCSHlBR1FmLy8vd2RMRFFBYUlBQWdBRUdBL2o5cVFSQjJRUWh4SWdGMElnQWdBRUdBNEI5cVFSQjJRUVJ4SWdCMElnTWdBMEdBZ0E5cVFSQjJRUUp4SWdOMFFROTJJQUFnQVhJZ0EzSnJJZ0ZCQVhRZ0JpQUJRUlZxZGtFQmNYSkJIR29MSWdFMkFnQWdBVUVDZEVIVU5Hb2hBRUdvTWlnQ0FDSURRUUVnQVhRaUJYRkZCRUFnQUNBQ05nSUFRYWd5SUFNZ0JYSTJBZ0FnQWtFWWFpQUFOZ0lBSUFJZ0FqWUNDQ0FDSUFJMkFnd01CQXNnQmtFQVFSa2dBVUVCZG1zZ0FVRWZSaHQwSVFFZ0FDZ0NBQ0VEQTBBZ0F5SUFLQUlFUVhoeElBWkdEUU1nQVVFZGRpRURJQUZCQVhRaEFTQUFJQU5CQkhGcVFSQnFJZ1VvQWdBaUF3MEFDeUFGSUFJMkFnQWdBa0VZYWlBQU5nSUFJQUlnQWpZQ0RDQUNJQUkyQWdnTUF3c2dCQ2dDQ0NFQklBUWdBRFlDQ0NBQklBQTJBZ3dnQUVFQU5nSVlJQUFnQVRZQ0NDQUFJQVEyQWd3TElBZEJDR29oQVF3RkN5QUFLQUlJSVFFZ0FDQUNOZ0lJSUFFZ0FqWUNEQ0FDUVJocVFRQTJBZ0FnQWlBQk5nSUlJQUlnQURZQ0RBdEJzRElvQWdBaUFTQUVUUTBBUWJ3eUtBSUFJZ0lnQkdvaUFDQUJJQVJySWdGQkFYSTJBZ1JCc0RJZ0FUWUNBRUc4TWlBQU5nSUFJQUlnQkVFRGNqWUNCQ0FDUVFocUlRRU1Bd3RCQUNFQlFaUTJRVEEyQWdBTUFnc0NRQ0FIUlEwQUFrQWdCU2dDSENJQ1FRSjBRZFEwYWlJQktBSUFJQVZHQkVBZ0FTQUROZ0lBSUFNTkFVR29NaUFJUVg0Z0FuZHhJZ2cyQWdBTUFnc2dCMEVRUVJRZ0J5Z0NFQ0FGUmh0cUlBTTJBZ0FnQTBVTkFRc2dBeUFITmdJWUlBVW9BaEFpQVFSQUlBTWdBVFlDRUNBQklBTTJBaGdMSUFWQkZHb29BZ0FpQVVVTkFDQURRUlJxSUFFMkFnQWdBU0FETmdJWUN3SkFJQUJCRDAwRVFDQUZJQUFnQkdvaUFVRURjallDQkNBQklBVnFJZ0VnQVNnQ0JFRUJjallDQkF3QkN5QUVJQVZxSWdNZ0FFRUJjallDQkNBRklBUkJBM0kyQWdRZ0FDQURhaUFBTmdJQUlBQkIvd0ZOQkVBZ0FFRURkaUlDUVFOMFFjd3lhaUVCQW45QnBESW9BZ0FpQUVFQklBSjBJZ0p4UlFSQVFhUXlJQUFnQW5JMkFnQWdBUXdCQ3lBQktBSUlDeUlDSUFNMkFnd2dBU0FETmdJSUlBTWdBVFlDRENBRElBSTJBZ2dNQVFzZ0F3Si9RUUFnQUVFSWRpSUNSUTBBR2tFZklBQkIvLy8vQjBzTkFCb2dBaUFDUVlEK1AycEJFSFpCQ0hFaUFYUWlBaUFDUVlEZ0gycEJFSFpCQkhFaUFuUWlCQ0FFUVlDQUQycEJFSFpCQW5FaUJIUkJEM1lnQVNBQ2NpQUVjbXNpQVVFQmRDQUFJQUZCRldwMlFRRnhja0VjYWdzaUFUWUNIQ0FEUWdBM0FoQWdBVUVDZEVIVU5Hb2hBaUFJUVFFZ0FYUWlCSEZGQkVBZ0FpQUROZ0lBUWFneUlBUWdDSEkyQWdBZ0F5QUNOZ0lZSUFNZ0F6WUNDQ0FESUFNMkFnd01BUXNnQUVFQVFSa2dBVUVCZG1zZ0FVRWZSaHQwSVFFZ0FpZ0NBQ0VFQWtBRFFDQUVJZ0lvQWdSQmVIRWdBRVlOQVNBQlFSMTJJUVFnQVVFQmRDRUJJQUlnQkVFRWNXcEJFR29pQmlnQ0FDSUVEUUFMSUFZZ0F6WUNBQ0FESUFJMkFoZ2dBeUFETmdJTUlBTWdBellDQ0F3QkN5QUNLQUlJSVFFZ0FpQUROZ0lJSUFFZ0F6WUNEQ0FEUVFBMkFoZ2dBeUFCTmdJSUlBTWdBallDREFzZ0JVRUlhaUVCREFFTEFrQWdDa1VOQUFKQUlBTW9BaHdpQUVFQ2RFSFVOR29pQVNnQ0FDQURSZ1JBSUFFZ0JUWUNBQ0FGRFFGQnFESWdDVUYrSUFCM2NUWUNBQXdDQ3lBS1FSQkJGQ0FLS0FJUUlBTkdHMm9nQlRZQ0FDQUZSUTBCQ3lBRklBbzJBaGdnQXlnQ0VDSUJCRUFnQlNBQk5nSVFJQUVnQlRZQ0dBc2dBMEVVYWlnQ0FDSUJSUTBBSUFWQkZHb2dBVFlDQUNBQklBVTJBaGdMQWtBZ0FrRVBUUVJBSUFNZ0FpQUVhaUlCUVFOeU5nSUVJQUVnQTJvaUFTQUJLQUlFUVFGeU5nSUVEQUVMSUFNZ0JHb2lBQ0FDUVFGeU5nSUVJQU1nQkVFRGNqWUNCQ0FBSUFKcUlBSTJBZ0FnQ0FSQUlBaEJBM1lpQlVFRGRFSE1NbW9oQkVHNE1pZ0NBQ0VCQW45QkFTQUZkQ0lGSUFaeFJRUkFRYVF5SUFVZ0JuSTJBZ0FnQkF3QkN5QUVLQUlJQ3lJRklBRTJBZ3dnQkNBQk5nSUlJQUVnQkRZQ0RDQUJJQVUyQWdnTFFiZ3lJQUEyQWdCQnJESWdBallDQUFzZ0EwRUlhaUVCQ3lBTFFSQnFKQUFnQVFzR0FDQUFFRElMbmcwQkIzOENRQ0FBUlEwQUlBQkJlR29pQWlBQVFYeHFLQUlBSWdGQmVIRWlBR29oQlFKQUlBRkJBWEVOQUNBQlFRTnhSUTBCSUFJZ0FpZ0NBQ0lCYXlJQ1FiUXlLQUlBSWdSSkRRRWdBQ0FCYWlFQUlBSkJ1RElvQWdCSEJFQWdBVUgvQVUwRVFDQUNLQUlJSWdjZ0FVRURkaUlHUVFOMFFjd3lha2NhSUFjZ0FpZ0NEQ0lEUmdSQVFhUXlRYVF5S0FJQVFYNGdCbmR4TmdJQURBTUxJQU1nQnpZQ0NDQUhJQU0yQWd3TUFnc2dBaWdDR0NFR0FrQWdBaUFDS0FJTUlnTkhCRUFnQkNBQ0tBSUlJZ0ZOQkVBZ0FTZ0NEQm9MSUFNZ0FUWUNDQ0FCSUFNMkFnd01BUXNDUUNBQ1FSUnFJZ0VvQWdBaUJBMEFJQUpCRUdvaUFTZ0NBQ0lFRFFCQkFDRUREQUVMQTBBZ0FTRUhJQVFpQTBFVWFpSUJLQUlBSWdRTkFDQURRUkJxSVFFZ0F5Z0NFQ0lFRFFBTElBZEJBRFlDQUFzZ0JrVU5BUUpBSUFJZ0FpZ0NIQ0lFUVFKMFFkUTBhaUlCS0FJQVJnUkFJQUVnQXpZQ0FDQUREUUZCcURKQnFESW9BZ0JCZmlBRWQzRTJBZ0FNQXdzZ0JrRVFRUlFnQmlnQ0VDQUNSaHRxSUFNMkFnQWdBMFVOQWdzZ0F5QUdOZ0lZSUFJb0FoQWlBUVJBSUFNZ0FUWUNFQ0FCSUFNMkFoZ0xJQUlvQWhRaUFVVU5BU0FEUVJScUlBRTJBZ0FnQVNBRE5nSVlEQUVMSUFVb0FnUWlBVUVEY1VFRFJ3MEFJQVVnQVVGK2NUWUNCRUdzTWlBQU5nSUFJQUFnQW1vZ0FEWUNBQ0FDSUFCQkFYSTJBZ1FQQ3lBRklBSk5EUUFnQlNnQ0JDSUJRUUZ4UlEwQUFrQWdBVUVDY1VVRVFDQUZRYnd5S0FJQVJnUkFRYnd5SUFJMkFnQkJzREpCc0RJb0FnQWdBR29pQURZQ0FDQUNJQUJCQVhJMkFnUWdBa0c0TWlnQ0FFY05BMEdzTWtFQU5nSUFRYmd5UVFBMkFnQVBDeUFGUWJneUtBSUFSZ1JBUWJneUlBSTJBZ0JCckRKQnJESW9BZ0FnQUdvaUFEWUNBQ0FDSUFCQkFYSTJBZ1FnQUNBQ2FpQUFOZ0lBRHdzZ0FVRjRjU0FBYWlFQUFrQWdBVUgvQVUwRVFDQUZLQUlNSVFRZ0JTZ0NDQ0lESUFGQkEzWWlCVUVEZEVITU1tb2lBVWNFUUVHME1pZ0NBQm9MSUFNZ0JFWUVRRUdrTWtHa01pZ0NBRUYrSUFWM2NUWUNBQXdDQ3lBQklBUkhCRUJCdERJb0FnQWFDeUFFSUFNMkFnZ2dBeUFFTmdJTURBRUxJQVVvQWhnaEJnSkFJQVVnQlNnQ0RDSURSd1JBUWJReUtBSUFJQVVvQWdnaUFVMEVRQ0FCS0FJTUdnc2dBeUFCTmdJSUlBRWdBellDREF3QkN3SkFJQVZCRkdvaUFTZ0NBQ0lFRFFBZ0JVRVFhaUlCS0FJQUlnUU5BRUVBSVFNTUFRc0RRQ0FCSVFjZ0JDSURRUlJxSWdFb0FnQWlCQTBBSUFOQkVHb2hBU0FES0FJUUlnUU5BQXNnQjBFQU5nSUFDeUFHUlEwQUFrQWdCU0FGS0FJY0lnUkJBblJCMURScUlnRW9BZ0JHQkVBZ0FTQUROZ0lBSUFNTkFVR29Na0dvTWlnQ0FFRitJQVIzY1RZQ0FBd0NDeUFHUVJCQkZDQUdLQUlRSUFWR0cyb2dBellDQUNBRFJRMEJDeUFESUFZMkFoZ2dCU2dDRUNJQkJFQWdBeUFCTmdJUUlBRWdBellDR0FzZ0JTZ0NGQ0lCUlEwQUlBTkJGR29nQVRZQ0FDQUJJQU0yQWhnTElBQWdBbW9nQURZQ0FDQUNJQUJCQVhJMkFnUWdBa0c0TWlnQ0FFY05BVUdzTWlBQU5nSUFEd3NnQlNBQlFYNXhOZ0lFSUFBZ0Ftb2dBRFlDQUNBQ0lBQkJBWEkyQWdRTElBQkIvd0ZOQkVBZ0FFRURkaUlCUVFOMFFjd3lhaUVBQW45QnBESW9BZ0FpQkVFQklBRjBJZ0Z4UlFSQVFhUXlJQUVnQkhJMkFnQWdBQXdCQ3lBQUtBSUlDeUlCSUFJMkFnd2dBQ0FDTmdJSUlBSWdBRFlDRENBQ0lBRTJBZ2dQQ3lBQ1FnQTNBaEFnQWtFY2FnSi9RUUFnQUVFSWRpSUVSUTBBR2tFZklBQkIvLy8vQjBzTkFCb2dCQ0FFUVlEK1AycEJFSFpCQ0hFaUFYUWlCQ0FFUVlEZ0gycEJFSFpCQkhFaUJIUWlBeUFEUVlDQUQycEJFSFpCQW5FaUEzUkJEM1lnQVNBRWNpQURjbXNpQVVFQmRDQUFJQUZCRldwMlFRRnhja0VjYWdzaUFUWUNBQ0FCUVFKMFFkUTBhaUVFQWtCQnFESW9BZ0FpQTBFQklBRjBJZ1Z4UlFSQUlBUWdBallDQUVHb01pQURJQVZ5TmdJQUlBSkJHR29nQkRZQ0FDQUNJQUkyQWdnZ0FpQUNOZ0lNREFFTElBQkJBRUVaSUFGQkFYWnJJQUZCSDBZYmRDRUJJQVFvQWdBaEF3SkFBMEFnQXlJRUtBSUVRWGh4SUFCR0RRRWdBVUVkZGlFRElBRkJBWFFoQVNBRUlBTkJCSEZxUVJCcUlnVW9BZ0FpQXcwQUN5QUZJQUkyQWdBZ0FrRVlhaUFFTmdJQUlBSWdBallDRENBQ0lBSTJBZ2dNQVFzZ0JDZ0NDQ0VBSUFRZ0FqWUNDQ0FBSUFJMkFnd2dBa0VZYWtFQU5nSUFJQUlnQURZQ0NDQUNJQVEyQWd3TFFjUXlRY1F5S0FJQVFYOXFJZ0kyQWdBZ0FnMEFRZXcxSVFJRFFDQUNLQUlBSWdCQkNHb2hBaUFBRFFBTFFjUXlRWDgyQWdBTEMxb0NBWDhCZmdKQUFuOUJBQ0FBUlEwQUdpQUFyU0FCclg0aUE2Y2lBaUFBSUFGeVFZQ0FCRWtOQUJwQmZ5QUNJQU5DSUlpbkd3c2lBaEF3SWdCRkRRQWdBRUY4YWkwQUFFRURjVVVOQUNBQVFRQWdBaEI5R2dzZ0FBdW5DQUVMZnlBQVJRUkFJQUVRTUE4TElBRkJRRThFUUVHVU5rRXdOZ0lBUVFBUEN5QUJRUXRKSVFNZ0FVRVRha0Z3Y1NFRUlBQkJlR29oQmlBQVFYeHFJZ2NvQWdBaUNFRURjU0VGUWJReUtBSUFJUXNDUUNBSVFYaHhJZ0pCQVVnTkFDQUZRUUZHRFFBTFFSQWdCQ0FER3lFREFrQUNRQ0FGUlFSQUlBTkJnQUpKRFFFZ0FpQURRUVJ5U1EwQklBSWdBMnRCaERZb0FnQkJBWFJORFFJTUFRc2dBaUFHYWlFRklBSWdBMDhFUUNBQ0lBTnJJZ0ZCRUVrTkFpQUhJQU1nQ0VFQmNYSkJBbkkyQWdBZ0F5QUdhaUlESUFGQkEzSTJBZ1FnQlNBRktBSUVRUUZ5TmdJRUlBTWdBUkExSUFBUEN5QUZRYnd5S0FJQVJnUkFRYkF5S0FJQUlBSnFJZ0lnQTAwTkFTQUhJQU1nQ0VFQmNYSkJBbkkyQWdCQnZESWdBeUFHYWlJQk5nSUFRYkF5SUFJZ0Eyc2lBellDQUNBQklBTkJBWEkyQWdRZ0FBOExJQVZCdURJb0FnQkdCRUJCckRJb0FnQWdBbW9pQWlBRFNRMEJBa0FnQWlBRGF5SUJRUkJQQkVBZ0J5QURJQWhCQVhGeVFRSnlOZ0lBSUFNZ0Jtb2lBeUFCUVFGeU5nSUVJQUlnQm1vaUFpQUJOZ0lBSUFJZ0FpZ0NCRUYrY1RZQ0JBd0JDeUFISUFoQkFYRWdBbkpCQW5JMkFnQWdBaUFHYWlJQklBRW9BZ1JCQVhJMkFnUkJBQ0VCUVFBaEF3dEJ1RElnQXpZQ0FFR3NNaUFCTmdJQUlBQVBDeUFGS0FJRUlnUkJBbkVOQUNBRVFYaHhJQUpxSWdrZ0Ewa05BQ0FKSUFOcklRd0NRQ0FFUWY4QlRRUkFJQVVvQWd3aEFTQUZLQUlJSWdJZ0JFRURkaUlFUVFOMFFjd3lha2NhSUFFZ0FrWUVRRUdrTWtHa01pZ0NBRUYrSUFSM2NUWUNBQXdDQ3lBQklBSTJBZ2dnQWlBQk5nSU1EQUVMSUFVb0FoZ2hDZ0pBSUFVZ0JTZ0NEQ0lFUndSQUlBc2dCU2dDQ0NJQlRRUkFJQUVvQWd3YUN5QUVJQUUyQWdnZ0FTQUVOZ0lNREFFTEFrQWdCVUVVYWlJQktBSUFJZ0lOQUNBRlFSQnFJZ0VvQWdBaUFnMEFRUUFoQkF3QkN3TkFJQUVoQ3lBQ0lnUkJGR29pQVNnQ0FDSUNEUUFnQkVFUWFpRUJJQVFvQWhBaUFnMEFDeUFMUVFBMkFnQUxJQXBGRFFBQ1FDQUZJQVVvQWh3aUFrRUNkRUhVTkdvaUFTZ0NBRVlFUUNBQklBUTJBZ0FnQkEwQlFhZ3lRYWd5S0FJQVFYNGdBbmR4TmdJQURBSUxJQXBCRUVFVUlBb29BaEFnQlVZYmFpQUVOZ0lBSUFSRkRRRUxJQVFnQ2pZQ0dDQUZLQUlRSWdFRVFDQUVJQUUyQWhBZ0FTQUVOZ0lZQ3lBRktBSVVJZ0ZGRFFBZ0JFRVVhaUFCTmdJQUlBRWdCRFlDR0FzZ0RFRVBUUVJBSUFjZ0NFRUJjU0FKY2tFQ2NqWUNBQ0FHSUFscUlnRWdBU2dDQkVFQmNqWUNCQ0FBRHdzZ0J5QURJQWhCQVhGeVFRSnlOZ0lBSUFNZ0Jtb2lBU0FNUVFOeU5nSUVJQVlnQ1dvaUF5QURLQUlFUVFGeU5nSUVJQUVnREJBMUlBQVBDeUFCRURBaUEwVUVRRUVBRHdzZ0F5QUFJQWNvQWdBaUFrRjRjVUVFUVFnZ0FrRURjUnRySWdJZ0FTQUNJQUZKR3hCL0lRRWdBQkF5SUFFaEFBc2dBQXVsREFFR2Z5QUFJQUZxSVFVQ1FBSkFJQUFvQWdRaUFrRUJjUTBBSUFKQkEzRkZEUUVnQUNnQ0FDSUNJQUZxSVFFZ0FDQUNheUlBUWJneUtBSUFSd1JBUWJReUtBSUFJUWNnQWtIL0FVMEVRQ0FBS0FJSUlnTWdBa0VEZGlJR1FRTjBRY3d5YWtjYUlBTWdBQ2dDRENJRVJnUkFRYVF5UWFReUtBSUFRWDRnQm5keE5nSUFEQU1MSUFRZ0F6WUNDQ0FESUFRMkFnd01BZ3NnQUNnQ0dDRUdBa0FnQUNBQUtBSU1JZ05IQkVBZ0J5QUFLQUlJSWdKTkJFQWdBaWdDREJvTElBTWdBallDQ0NBQ0lBTTJBZ3dNQVFzQ1FDQUFRUlJxSWdJb0FnQWlCQTBBSUFCQkVHb2lBaWdDQUNJRURRQkJBQ0VEREFFTEEwQWdBaUVISUFRaUEwRVVhaUlDS0FJQUlnUU5BQ0FEUVJCcUlRSWdBeWdDRUNJRURRQUxJQWRCQURZQ0FBc2dCa1VOQVFKQUlBQWdBQ2dDSENJRVFRSjBRZFEwYWlJQ0tBSUFSZ1JBSUFJZ0F6WUNBQ0FERFFGQnFESkJxRElvQWdCQmZpQUVkM0UyQWdBTUF3c2dCa0VRUVJRZ0JpZ0NFQ0FBUmh0cUlBTTJBZ0FnQTBVTkFnc2dBeUFHTmdJWUlBQW9BaEFpQWdSQUlBTWdBallDRUNBQ0lBTTJBaGdMSUFBb0FoUWlBa1VOQVNBRFFSUnFJQUkyQWdBZ0FpQUROZ0lZREFFTElBVW9BZ1FpQWtFRGNVRURSdzBBSUFVZ0FrRitjVFlDQkVHc01pQUJOZ0lBSUFVZ0FUWUNBQ0FBSUFGQkFYSTJBZ1FQQ3dKQUlBVW9BZ1FpQWtFQ2NVVUVRQ0FGUWJ3eUtBSUFSZ1JBUWJ3eUlBQTJBZ0JCc0RKQnNESW9BZ0FnQVdvaUFUWUNBQ0FBSUFGQkFYSTJBZ1FnQUVHNE1pZ0NBRWNOQTBHc01rRUFOZ0lBUWJneVFRQTJBZ0FQQ3lBRlFiZ3lLQUlBUmdSQVFiZ3lJQUEyQWdCQnJESkJyRElvQWdBZ0FXb2lBVFlDQUNBQUlBRkJBWEkyQWdRZ0FDQUJhaUFCTmdJQUR3dEJ0RElvQWdBaEJ5QUNRWGh4SUFGcUlRRUNRQ0FDUWY4QlRRUkFJQVVvQWd3aEJDQUZLQUlJSWdNZ0FrRURkaUlGUVFOMFFjd3lha2NhSUFNZ0JFWUVRRUdrTWtHa01pZ0NBRUYrSUFWM2NUWUNBQXdDQ3lBRUlBTTJBZ2dnQXlBRU5nSU1EQUVMSUFVb0FoZ2hCZ0pBSUFVZ0JTZ0NEQ0lEUndSQUlBY2dCU2dDQ0NJQ1RRUkFJQUlvQWd3YUN5QURJQUkyQWdnZ0FpQUROZ0lNREFFTEFrQWdCVUVVYWlJQ0tBSUFJZ1FOQUNBRlFSQnFJZ0lvQWdBaUJBMEFRUUFoQXd3QkN3TkFJQUloQnlBRUlnTkJGR29pQWlnQ0FDSUVEUUFnQTBFUWFpRUNJQU1vQWhBaUJBMEFDeUFIUVFBMkFnQUxJQVpGRFFBQ1FDQUZJQVVvQWh3aUJFRUNkRUhVTkdvaUFpZ0NBRVlFUUNBQ0lBTTJBZ0FnQXcwQlFhZ3lRYWd5S0FJQVFYNGdCSGR4TmdJQURBSUxJQVpCRUVFVUlBWW9BaEFnQlVZYmFpQUROZ0lBSUFORkRRRUxJQU1nQmpZQ0dDQUZLQUlRSWdJRVFDQURJQUkyQWhBZ0FpQUROZ0lZQ3lBRktBSVVJZ0pGRFFBZ0EwRVVhaUFDTmdJQUlBSWdBellDR0FzZ0FDQUJhaUFCTmdJQUlBQWdBVUVCY2pZQ0JDQUFRYmd5S0FJQVJ3MEJRYXd5SUFFMkFnQVBDeUFGSUFKQmZuRTJBZ1FnQUNBQmFpQUJOZ0lBSUFBZ0FVRUJjallDQkFzZ0FVSC9BVTBFUUNBQlFRTjJJZ0pCQTNSQnpESnFJUUVDZjBHa01pZ0NBQ0lFUVFFZ0FuUWlBbkZGQkVCQnBESWdBaUFFY2pZQ0FDQUJEQUVMSUFFb0FnZ0xJZ0lnQURZQ0RDQUJJQUEyQWdnZ0FDQUJOZ0lNSUFBZ0FqWUNDQThMSUFCQ0FEY0NFQ0FBUVJ4cUFuOUJBQ0FCUVFoMklnUkZEUUFhUVI4Z0FVSC8vLzhIU3cwQUdpQUVJQVJCZ1A0L2FrRVFka0VJY1NJQ2RDSUVJQVJCZ09BZmFrRVFka0VFY1NJRWRDSURJQU5CZ0lBUGFrRVFka0VDY1NJRGRFRVBkaUFDSUFSeUlBTnlheUlDUVFGMElBRWdBa0VWYW5aQkFYRnlRUnhxQ3lJQ05nSUFJQUpCQW5SQjFEUnFJUVJCcURJb0FnQWlBMEVCSUFKMElnVnhSUVJBSUFRZ0FEWUNBRUdvTWlBRElBVnlOZ0lBSUFCQkdHb2dCRFlDQUNBQUlBQTJBZ2dnQUNBQU5nSU1Ed3NnQVVFQVFSa2dBa0VCZG1zZ0FrRWZSaHQwSVFJZ0JDZ0NBQ0VEQWtBRFFDQURJZ1FvQWdSQmVIRWdBVVlOQVNBQ1FSMTJJUU1nQWtFQmRDRUNJQVFnQTBFRWNXcEJFR29pQlNnQ0FDSUREUUFMSUFVZ0FEWUNBQ0FBUVJocUlBUTJBZ0FnQUNBQU5nSU1JQUFnQURZQ0NBOExJQVFvQWdnaEFTQUVJQUEyQWdnZ0FTQUFOZ0lNSUFCQkdHcEJBRFlDQUNBQUlBRTJBZ2dnQUNBRU5nSU1Dd3RnQVFGL0FrQUNmeUFCUVJCR0JFQWdBaEF3REFFTFFSd2hBeUFCUVFOeERRRWdBVUVDZG1sQkFVY05BVUV3SVFOQlFDQUJheUFDU1EwQklBRkJFQ0FCUVJCTEd5QUNFRGNMSWdGRkJFQkJNQThMSUFBZ0FUWUNBRUVBSVFNTElBTUxrd01CQlg4Q1FDQUFRUkFnQUVFUVN4c2lBeUFEUVg5cWNVVUVRQ0FESVFBTUFRdEJJQ0VDQTBBZ0FpSUFRUUYwSVFJZ0FDQURTUTBBQ3d0QlFDQUFheUFCVFFSQVFaUTJRVEEyQWdCQkFBOExRUkFnQVVFVGFrRndjU0FCUVF0Skd5SUJRUXh5SUFCcUVEQWlBa1VFUUVFQUR3c2dBa0Y0YWlFREFrQWdBRUYvYWlBQ2NVVUVRQ0FESVFBTUFRc2dBa0Y4YWlJRktBSUFJZ1pCZUhFZ0FDQUNha0YvYWtFQUlBQnJjVUY0YWlJQ0lBQWdBbW9nQWlBRGEwRVBTeHNpQUNBRGF5SUNheUVFSUFaQkEzRkZCRUFnQUNBRU5nSUVJQUFnQXlnQ0FDQUNhallDQUF3QkN5QUFJQVFnQUNnQ0JFRUJjWEpCQW5JMkFnUWdBQ0FFYWlJRUlBUW9BZ1JCQVhJMkFnUWdCU0FDSUFVb0FnQkJBWEZ5UVFKeU5nSUFJQUFnQUNnQ0JFRUJjallDQkNBRElBSVFOUXNDUUNBQUtBSUVJZ0pCQTNGRkRRQWdBa0Y0Y1NJRElBRkJFR3BORFFBZ0FDQUJJQUpCQVhGeVFRSnlOZ0lFSUFBZ0FXb2lBaUFESUFGcklnRkJBM0kyQWdRZ0FDQURhaUlESUFNb0FnUkJBWEkyQWdRZ0FpQUJFRFVMSUFCQkNHb0xGUUFnQUVFUVRRUkFJQUVRTUE4TElBQWdBUkEzQ3pBQkFYOENRQ0FBUlEwQUlBQkJmR29vQWdBaUFFRURjU0lCUVFGR0RRQWdBRUY0Y1VFRVFRZ2dBUnRyRHd0QkFBdENBQ0FBUlFSQVB3QkJFSFFQQ3dKQUlBQkIvLzhEY1EwQUlBQkJmMHdOQUNBQVFSQjJRQUFpQUVGL1JnUkFRWlEyUVRBMkFnQkJmdzhMSUFCQkVIUVBDd0FMQXdBQUM1Y0JBUU4vSXdCQmdBRnJJZ1FrQUVGL0lRWWdCQ0FCUVg5cUlnVkJBQ0FGSUFGSklnVWJOZ0owSUFRZ0FDQUVRZjRBYWlBRkd5SUFOZ0p3SUFSQkFFSHdBQkI5SWdSQmZ6WUNRQ0FFUVFFMkFpQWdCQ0FFUWZBQWFqWUNSQ0FFSUFSQi93QnFOZ0lvQWtBZ0FVRi9UQVJBUVpRMlFUMDJBZ0FNQVFzZ0FFRUFPZ0FBSUFRZ0FpQURFSGdoQmdzZ0JFR0FBV29rQUNBR0M2a0JBUVIvSUFBb0FrUWlBeWdDQkNJRklBQW9BaFFnQUNnQ0dDSUdheUlFSUFVZ0JFa2JJZ1FFUUNBREtBSUFJQVlnQkJCL0dpQURJQU1vQWdBZ0JHbzJBZ0FnQXlBREtBSUVJQVJySWdVMkFnUUxJQU1vQWdBaEJDQUZJQUlnQlNBQ1NSc2lCUVJBSUFRZ0FTQUZFSDhhSUFNZ0F5Z0NBQ0FGYWlJRU5nSUFJQU1nQXlnQ0JDQUZhellDQkFzZ0JFRUFPZ0FBSUFBZ0FDZ0NLQ0lETmdJWUlBQWdBellDRkNBQ0N3VUFRWmcyQzhvQ0FRTi9RWmcyS0FJQUlnQUVRQU5BSUFBb0FoUWdBQ2dDR0VjRVFDQUFRUUJCQUNBQUtBSWdFUUVBR2dzZ0FDZ0NCQ0lCSUFBb0FnZ2lBa2NFUUNBQUlBRWdBbXVzUVFFZ0FDZ0NKQkVJQUJvTElBQW9BalFpQUEwQUN3c0NRRUdjTmlnQ0FDSUFSUTBBSUFBb0FoUWdBQ2dDR0VjRVFDQUFRUUJCQUNBQUtBSWdFUUVBR2dzZ0FDZ0NCQ0lCSUFBb0FnZ2lBa1lOQUNBQUlBRWdBbXVzUVFFZ0FDZ0NKQkVJQUJvTEFrQkJuRFlvQWdBaUFFVU5BQ0FBS0FJVUlBQW9BaGhIQkVBZ0FFRUFRUUFnQUNnQ0lCRUJBQm9MSUFBb0FnUWlBU0FBS0FJSUlnSkdEUUFnQUNBQklBSnJyRUVCSUFBb0FpUVJDQUFhQ3dKQVFhQXlLQUlBSWdCRkRRQWdBQ2dDRkNBQUtBSVlSd1JBSUFCQkFFRUFJQUFvQWlBUkFRQWFDeUFBS0FJRUlnRWdBQ2dDQ0NJQ1JnMEFJQUFnQVNBQ2E2eEJBU0FBS0FJa0VRZ0FHZ3NMV1FFQmZ5QUFJQUFvQWp3aUFVRi9haUFCY2pZQ1BDQUFLQUlBSWdGQkNIRUVRQ0FBSUFGQklISTJBZ0JCZnc4TElBQkNBRGNDQkNBQUlBQW9BaWdpQVRZQ0dDQUFJQUUyQWhRZ0FDQUJJQUFvQWl4cU5nSVFRUUFMQkFBUVB3dlRBUUVHZndKQUlBSW9BaEFpQXdSL0lBTUZJQUlRUUEwQklBSW9BaEFMSUFJb0FoUWlCbXNnQVVrRVFDQUNJQUFnQVNBQ0tBSWdFUUVBRHdzQ1FDQUNLQUpBUVFCSURRQWdBQ0VFUVFBaEF3TkFJQUVnQTBZTkFTQURRUUZxSVFNZ0FTQUVhaUVISUFSQmYyb2lDQ0VFSUFkQmYyb3RBQUJCQ2tjTkFBc2dBaUFBSUFFZ0EydEJBV29pQlNBQ0tBSWdFUUVBSWdRZ0JVa05BU0FCSUFocVFRRnFJUUFnQWlnQ0ZDRUdJQU5CZjJvaEFRc2dCaUFBSUFFUWZ4b2dBaUFDS0FJVUlBRnFOZ0lVSUFFZ0JXb2hCQXNnQkF2M0FRRUhmeUFCSUFKc0lRVUNRQ0FES0FJUUlnUUVmeUFFQlVFQUlRUWdBeEJBRFFFZ0F5Z0NFQXNnQXlnQ0ZDSUlheUFGU1FSQUlBTWdBQ0FGSUFNb0FpQVJBUUFoQkF3QkN3Si9JQVVnQXlnQ1FFRUFTQTBBR2lBQUlBVnFJUWxCQUNFRUEwQWdCU0FFSUFWcVJRMEJHaUFFSUFscUlRb2dCRUYvYWlJSElRUWdDa0YvYWkwQUFFRUtSdzBBQ3lBRElBQWdCU0FIYWtFQmFpSUdJQU1vQWlBUkFRQWlCQ0FHU1EwQklBY2dDV3BCQVdvaEFDQURLQUlVSVFnZ0IwRi9jd3NoQkNBSUlBQWdCQkIvR2lBRElBTW9BaFFnQkdvMkFoUWdCQ0FHYWlFRUN5QUVJQVZHQkVBZ0FrRUFJQUViRHdzZ0JDQUJiZ3NoQUNBQktBSVVHa0VBSUFBZ0FFSE1BRXNiUVFGMFFaQVVhaThCQUVHQUNHb0xPd0VCZjBIQU5pZ0NBQ0lCQkg4Z0FRVkJ3RFpCcURZMkFnQkJxRFlMS0FJVUdrRUFJQUFnQUVITUFFc2JRUUYwUVpBVWFpOEJBRUdBQ0dvTERRQWdBQ0FCRUFGQi8vOERjUXNOQUNBQUlBRVFBa0gvL3dOeEN3MEFJQUFnQVJBRFFmLy9BM0VMRFFBZ0FDQUJFQVJCLy84RGNRc05BQ0FBSUFFUUJVSC8vd054Q3c4QUlBQWdBU0FDRUFaQi8vOERjUXNSQUNBQUlBRWdBaUFERUFkQi8vOERjUXNQQUNBQUlBRWdBaEFJUWYvL0EzRUxDd0FnQUJBSlFmLy9BM0VMQ3dBZ0FCQUtRZi8vQTNFTERRQWdBQ0FCRUF0Qi8vOERjUXNOQUNBQUlBRVFERUgvL3dOeEN3OEFJQUFnQVNBQ0VBMUIvLzhEY1FzTkFDQUFJQUVRRGtILy93TnhDdzBBSUFBZ0FSQVBRZi8vQTNFTEVRQWdBQ0FCSUFJZ0F4QVFRZi8vQTNFTEV3QWdBQ0FCSUFJZ0F5QUVFQkZCLy84RGNRc05BQ0FBSUFFUUVrSC8vd054Q3c4QUlBQWdBU0FDRUJOQi8vOERjUXNUQUNBQUlBRWdBaUFESUFRUUZFSC8vd054Q3hFQUlBQWdBU0FDSUFNUUZVSC8vd054Q3hNQUlBQWdBU0FDSUFNZ0JCQVdRZi8vQTNFTERRQWdBQ0FCRUJkQi8vOERjUXNSQUNBQUlBRWdBaUFERUJoQi8vOERjUXNMQUNBQUVCbEIvLzhEY1FzTkFDQUFJQUVRR2tILy93TnhDeEVBSUFBZ0FTQUNJQU1RRzBILy93TnhDeElBSUFBZ0FTQUJFSUFCRUJ4Qi8vOERjUXNXQUNBQUlBRWdBaUFDRUlBQklBTVFIVUgvL3dOeEN4b0FJQUFnQVNBQ0lBSVFnQUVnQXlBRUlBVVFIa0gvL3dOeEN4MEFJQUFnQVNBQ0lBSVFnQUVnQXlBRUlBUVFnQUVRSDBILy93TnhDeDRBSUFBZ0FTQUNJQUlRZ0FFZ0F5QUVJQVVnQmlBSEVDQkIvLzhEY1FzWUFDQUFJQUVnQVJDQUFTQUNJQU1nQkJBaFFmLy9BM0VMRWdBZ0FDQUJJQUVRZ0FFUUlrSC8vd054Q3hzQUlBQWdBU0FCRUlBQklBSWdBeUFERUlBQkVDTkIvLzhEY1FzWkFDQUFJQUFRZ0FFZ0FTQUNJQUlRZ0FFUUpFSC8vd054Q3hJQUlBQWdBU0FCRUlBQkVDVkIvLzhEY1FzUkFDQUFJQUVnQWlBREVDWkIvLzhEY1FzSEFDQUFFQ2NBQ3dzQUlBQVFLRUgvL3dOeEN3a0FFQ2xCLy84RGNRc05BQ0FBSUFFUUtrSC8vd054Q3hVQUlBQWdBU0FDSUFNZ0JDQUZFQ3RCLy84RGNRc1RBQ0FBSUFFZ0FpQURJQVFRTEVILy93TnhDdzBBSUFBZ0FSQXRRZi8vQTNFTFVnRUNmeU1BUVJCcklnTWtBRUYvSVFRQ1FDQUNRWDlNQkVCQmxEWkJIRFlDQUF3QkN5QUFJQUVnQWlBRFFReHFFR0FpQWdSQVFaUTJJQUkyQWdBTUFRc2dBeWdDRENFRUN5QURRUkJxSkFBZ0JBdWFBZ0VHZnlNQVFSQnJJZ01rQUNBRElBSTJBZ3dnQXlBQk5nSUlJQU1nQUNnQ0dDSUJOZ0lBSUFNZ0FDZ0NGQ0FCYXlJQk5nSUVRUUloQmdKL0lBRWdBbW9pQnlBQUtBSTRJQU5CQWhCeklnUkhCRUFnQXlFQkEwQWdCRUYvVEFSQUlBQkJBRFlDR0NBQVFnQTNBeEFnQUNBQUtBSUFRU0J5TmdJQVFRQWdCa0VDUmcwREdpQUNJQUVvQWdSckRBTUxJQUZCQ0dvZ0FTQUVJQUVvQWdRaUNFc2lCUnNpQVNBRUlBaEJBQ0FGRzJzaUNDQUJLQUlBYWpZQ0FDQUJJQUVvQWdRZ0NHczJBZ1FnQnlBRWF5RUhJQUFvQWpnZ0FTQUdJQVZySWdZUWN5SUZJUVFnQlNBSFJ3MEFDd3NnQUNBQUtBSW9JZ0UyQWhnZ0FDQUJOZ0lVSUFBZ0FTQUFLQUlzYWpZQ0VDQUNDeUVFSUFOQkVHb2tBQ0FFQzB3QkFYOGpBRUVRYXlJREpBQUNmaUFBSUFFZ0FrSC9BWEVnQTBFSWFoQmRJZ0FFUUVHVU5rSEdBQ0FBSUFCQnpBQkdHellDQUVKL0RBRUxJQU1wQXdnTElRRWdBMEVRYWlRQUlBRUxEUUFnQUNnQ09DQUJJQUlRZFFzYkFRRi9RWDlCQUNBQUVJQUJJZ0lnQUVFQklBSWdBUkJEUnhzTDR3SUJBMzhqQUVIUUFXc2lBeVFBSUFNZ0FqWUN6QUVnQTBIQUFXcENBRGNEQUNBRFFiZ0Jha0lBTndNQUlBTkJzQUZxUWdBM0F3QWdBMElBTndPb0FTQURRZ0EzQTZBQklBTWdBallDeUFFQ2YwRi9RUUFnQVNBRFFjZ0JhaUFEUWRBQWFpQURRYUFCYWhCNVFRQklEUUFhSUFBb0FnQWhCU0FBS0FJOFFRQk1CRUFnQUNBRlFWOXhOZ0lBQ3dKL0FrQUNRQ0FBS0FJc1JRUkFJQUJCMEFBMkFpd2dBRUVBTmdJWUlBQkNBRGNERUNBQUtBSW9JUVFnQUNBRE5nSW9EQUVMSUFBb0FoQU5BUXRCZnlBQUVFQU5BUm9MSUFBZ0FTQURRY2dCYWlBRFFkQUFhaUFEUWFBQmFoQjVDeUVDSUFWQklIRWhBU0FFQkVBZ0FFRUFRUUFnQUNnQ0lCRUJBQm9nQUVFQU5nSXNJQUFnQkRZQ0tDQUFRUUEyQWhnZ0FFRUFOZ0lRSUFBb0FoUWhCQ0FBUVFBMkFoUWdBa0YvSUFRYklRSUxJQUFnQUNnQ0FDSUVJQUZ5TmdJQVFYOGdBaUFFUVNCeEd3c2hBQ0FEUWRBQmFpUUFJQUFMdVVZREgzOENmZ0o4SXdCQjhBWnJJZ29rQUNBS1FkQUNha0VJY2lFZklBcEJOMm9oSUVHdWZTQUtheUVoSUFwQjBBSnFRUWx5SVJvZ0NrR1FCV29oSWlBS1FkQUNhaUVaUVFBZ0NrSFFBbXBySVI0Z0NrRTRhaUVXQWtBQ1FBTkFBa0FnQVNFSUlBVkIvLy8vL3djZ0ZXdEtEUUFnQlNBVmFpRVZBa0FDUUFKQUlBZ3RBQUFpQlFSQUEwQUNRQUpBSUFWQi93RnhJZ1VFUUNBRlFTVkhEUUlnQVNJR0lRVURRQ0FGUVFGcUxRQUFRU1ZIQkVBZ0JTRUJEQU1MSUFaQkFXb2hCaUFGTFFBQ0lRY2dCVUVDYWlJQklRVWdCMEVsUmcwQUN3d0JDeUFCSVFZTElBWWdDR3NpQlVILy8vLy9CeUFWYXlJSFNnMEdBa0FnQUVVTkFDQUFMUUFBUVNCeERRQWdDQ0FGSUFBUVFob0xJQVVOQnlBQlFRRnFJUVVDZjBGL0lBRXNBQUVpQ1VGUWFpSUxRUWxMRFFBYUlBRkJBMm9nQlNBQkxRQUNRU1JHSWdZYklRVkJBU0FZSUFZYklSZ2dBVUVEUVFFZ0JodHFMQUFBSVFrZ0MwRi9JQVliQ3lFUVFRQWhCZ0pBSUFsQllHb2lBVUVmU3dSQUlBVWhBUXdCQzBFQklBRjBJZ3RCaWRFRWNVVUVRQ0FGSVFFTUFRc0RRQ0FGUVFGcUlRRWdCaUFMY2lFR0lBVXNBQUVpQ1VGZ2FpSUxRUjlMRFFFZ0FTRUZRUUVnQzNRaUMwR0owUVJ4RFFBTEN3SkFJQWxCS2tZRVFBSi9Ba0FnQVN3QUFVRlFhaUlGUVFsTERRQWdBUzBBQWtFa1J3MEFJQVFnQlVFQ2RHcEJDallDQUNBQlFRTnFJUXhCQVNFWUlBRXNBQUZCQTNRZ0EycEJnSDFxS0FJQURBRUxJQmdOQmlBQlFRRnFJUXdnQUVVRVFFRUFJUmhCQUNFTkRBTUxJQUlnQWlnQ0FDSUJRUVJxTmdJQVFRQWhHQ0FCS0FJQUN5SU5RWDlLRFFGQkFDQU5heUVOSUFaQmdNQUFjaUVHREFFTFFRQWhEU0FKUVZCcUlndEJDVXNFUUNBQklRd01BUXRCQUNFRkEwQkJmeUVOSUFWQnpKbXo1Z0JOQkVCQmZ5QUZRUXBzSWdVZ0Myb2dDMEgvLy8vL0J5QUZhMG9iSVEwTElBRXNBQUVoQ3lBQlFRRnFJZ3doQVNBTklRVWdDMEZRYWlJTFFRcEpEUUFMSUExQkFFZ05Cd3RCQUNFRlFYOGhDUUpBSUF3dEFBQkJMa2NFUUNBTUlRRkJBQ0VUREFFTElBd3NBQUVpQzBFcVJnUkFBbjhDUUNBTUxBQUNRVkJxSWdGQkNVc05BQ0FNTFFBRFFTUkhEUUFnQkNBQlFRSjBha0VLTmdJQUlBeEJCR29oQVNBTUxBQUNRUU4wSUFOcVFZQjlhaWdDQUF3QkN5QVlEUVlnREVFQ2FpRUJRUUFnQUVVTkFCb2dBaUFDS0FJQUlndEJCR28yQWdBZ0N5Z0NBQXNpQ1VGL2MwRWZkaUVUREFFTElBeEJBV29oQVNBTFFWQnFJZzlCQ1VzRVFFRUJJUk5CQUNFSkRBRUxRUUFoRENBQklRc0RRRUYvSVFrZ0RFSE1tYlBtQUUwRVFFRi9JQXhCQ213aUFTQVBhaUFQUWYvLy8vOEhJQUZyU2hzaENRdEJBU0VUSUFzc0FBRWhEeUFMUVFGcUlnRWhDeUFKSVF3Z0QwRlFhaUlQUVFwSkRRQUxDd05BSUFVaEN5QUJMQUFBUWI5L2FpSUZRVGxMRFFRZ0FVRUJhaUVCSUF0Qk9td2dCV3BCMEJWcUxRQUFJZ1ZCZjJwQkNFa05BQXNnQlVVTkF3SkFBa0FDUUNBRlFSdEdCRUFnRUVGL1RBMEJEQWNMSUJCQkFFZ05BU0FFSUJCQkFuUnFJQVUyQWdBZ0NpQURJQkJCQTNScUtRTUFOd000QzBFQUlRVWdBRVVOQ1F3QkN5QUFSUVJBUVFBaEZRd0xDeUFLUVRocUlBVWdBaEI2Q3lBR1FmLy9lM0VpRENBR0lBWkJnTUFBY1JzaEVBSkFBa0FDUUNBQlFYOXFMQUFBSWdWQlgzRWdCU0FGUVE5eFFRTkdHeUFGSUFzYkloRkJ2MzlxSWdWQk4wc05BQUpBQWtBQ2Z3SkFBa0FDZndKQUFrQUNRQUpBQW44Q1FBSkFBa0FDUUFKQUFrQWdCVUVCYXc0M0VRMFJFQkFRRVJFUkVSRVJFUkVSRVJFTUVSRVJFUU1SRVJFUkVSRVJFUkFSQ0FVUUVCQVJCUkVSRVFrQkJBSVJFUW9SQUJFUkF4QUxRUUFoRWlBS0tRTTRJU1JCc0JVTUJRdEJBQ0VGSUF0Qi93RnhJZ1pCQjBzTkdRSkFBa0FDUUFKQUFrQUNRQUpBSUFaQkFXc09Cd0VDQXdRZ0JRWUFDeUFLS0FJNElCVTJBZ0FNSHdzZ0NpZ0NPQ0FWTmdJQURCNExJQW9vQWpnZ0ZhdzNBd0FNSFFzZ0NpZ0NPQ0FWT3dFQURCd0xJQW9vQWpnZ0ZUb0FBQXdiQ3lBS0tBSTRJQlUyQWdBTUdnc2dDaWdDT0NBVnJEY0RBQXdaQ3lBSlFRZ2dDVUVJU3hzaENTQVFRUWh5SVJCQitBQWhFUXRCQUNFU1FiQVZJUlFnQ2lrRE9DSWtVQVJBSUJZaENBd0VDeUFSUVNCeElRVWdGaUVJQTBBZ0NFRi9haUlJSUNTblFROXhRYkFhYWkwQUFDQUZjam9BQUNBa1FnU0lJaVJDQUZJTkFBc2dFRUVJY1VVTkF5QUtLUU00VUEwRElCRkJCSFZCc0JWcUlSUkJBaUVTREFNTElCWWhDQ0FLS1FNNElpUlFSUVJBQTBBZ0NFRi9haUlJSUNTblFRZHhRVEJ5T2dBQUlDUkNBNGdpSkVJQVVnMEFDd3RCQUNFU1FiQVZJUlFnRUVFSWNVVU5BaUFKSUJZZ0NHc2lCVUVCYWlBSklBVktHeUVKREFJTElBb3BBemdpSkVKL1Z3UkFJQXBDQUNBa2ZTSWtOd000UVFFaEVrR3dGUXdCQ3lBUVFZQVFjUVJBUVFFaEVrR3hGUXdCQzBHeUZVR3dGU0FRUVFGeEloSWJDeUVVQWtBZ0pFS0FnSUNBRUZRRVFDQWtJU1VnRmlFSURBRUxJQlloQ0FOQUlBaEJmMm9pQ0NBa0lDUkNDb0FpSlVJS2ZuMm5RVEJ5T2dBQUlDUkMvLy8vLzU4QlZpRUZJQ1VoSkNBRkRRQUxDeUFscHlJRlJRMEFBMEFnQ0VGL2FpSUlJQVVnQlVFS2JpSUdRUXBzYTBFd2Nqb0FBQ0FGUVFsTElRc2dCaUVGSUFzTkFBc0xJQk5CQUNBSlFRQklHdzBTSUJCQi8vOTdjU0FRSUJNYklSQWdDaWtET0NFa0FrQWdDUTBBSUNSUVJRMEFJQllpQ0NFRlFRQWhDUXdTQ3lBSklDUlFJQllnQ0d0cUlnVWdDU0FGU2hzaENRd0tDeUFLSUFvcEF6ZzhBRGRCQUNFU1FiQVZJUlJCQVNFSklDQWhDQ0FXSVFVZ0RDRVFEQkFMUVpRMktBSUFFRVVNQVFzZ0NpZ0NPQ0lGUWJvVklBVWJDeUVJUVFBaEVpQUlJQWhCLy8vLy93Y2dDU0FKUVFCSUd4QitJZ1pxSVFWQnNCVWhGQ0FKUVg5TURRY2dEQ0VRSUFZaENRd05DeUFLS0FJNElnZ2dDUTBCR2tFQUlRVU1BZ3NnQ2tFQU5nSU1JQW9nQ2lrRE9ENENDQ0FLSUFwQkNHbzJBamhCZnlFSklBcEJDR29MSVFoQkFDRUZJQWdoQmdKQUEwQWdCaWdDQUNJSFJRMEJBa0FnQ2tFRWFpQUhFSVFCSWdkQkFFZ2lDdzBBSUFjZ0NTQUZhMHNOQUNBR1FRUnFJUVlnQ1NBRklBZHFJZ1ZMRFFFTUFnc0xJQXNORGdzZ0JVRUFTQTBMQ3dKQUlCQkJnTUFFY1NJTURRQWdEU0FGVEEwQUlBcEJRR3RCSUNBTklBVnJJZzlCZ0FJZ0QwR0FBa2tpQmhzUWZSb2dBQ2dDQUNJTFFTQnhJUWNDUUNBR1JRUkFJQWRGSVFZZ0R5RUhBMEFnQmtFQmNRUkFJQXBCUUd0QmdBSWdBQkJDR2lBQUtBSUFJUXNMSUF0QklIRWlDVVVoQmlBSFFZQithaUlIUWY4QlN3MEFDeUFKRFFJZ0QwSC9BWEVoRHd3QkN5QUhEUUVMSUFwQlFHc2dEeUFBRUVJYUN3SkFJQVZGRFFCQkFDRUdBMEFnQ0NnQ0FDSUhSUTBCSUFwQkJHb2dCeENFQVNJSElBWnFJZ1lnQlVzTkFTQUFMUUFBUVNCeFJRUkFJQXBCQkdvZ0J5QUFFRUlhQ3lBSVFRUnFJUWdnQmlBRlNRMEFDd3NDUUNBTVFZREFBRWNOQUNBTklBVk1EUUFnQ2tGQWEwRWdJQTBnQldzaUNVR0FBaUFKUVlBQ1NTSUdHeEI5R2lBQUtBSUFJZ2hCSUhFaEJ3SkFJQVpGQkVBZ0IwVWhCaUFKSVFjRFFDQUdRUUZ4QkVBZ0NrRkFhMEdBQWlBQUVFSWFJQUFvQWdBaENBc2dDRUVnY1NJTFJTRUdJQWRCZ0g1cUlnZEIvd0ZMRFFBTElBc05BaUFKUWY4QmNTRUpEQUVMSUFjTkFRc2dDa0ZBYXlBSklBQVFRaG9MSUEwZ0JTQU5JQVZLR3lFRkRBc0xJQWxCZjB4QkFDQVRHdzBKSUFvckF6Z2hKaUFLUVFBMkF1d0NBbjhnSnIxQ2YxY0VRQ0FtbWlFbVFRRWhGMEhBR2d3QkN5QVFRWUFRY1FSQVFRRWhGMEhER2d3QkMwSEdHa0hCR2lBUVFRRnhJaGNiQ3lFYkFrQWdKcGtpSjBRQUFBQUFBQUR3ZjJJZ0p5QW5ZWEZGQkVBZ0YwRURhaUVMQWtBZ0VFR0F3QUJ4RFFBZ0RTQUxUQTBBSUFwQlFHdEJJQ0FOSUF0cklnbEJnQUlnQ1VHQUFra2lCUnNRZlJvZ0FDZ0NBQ0lIUVNCeElRWUNRQ0FGUlFSQUlBWkZJUVVnQ1NFR0EwQWdCVUVCY1FSQUlBcEJRR3RCZ0FJZ0FCQkNHaUFBS0FJQUlRY0xJQWRCSUhFaUNFVWhCU0FHUVlCK2FpSUdRZjhCU3cwQUN5QUlEUUlnQ1VIL0FYRWhDUXdCQ3lBR0RRRUxJQXBCUUdzZ0NTQUFFRUlhQ3lBQUtBSUFJZ1ZCSUhFRWZ5QUZCU0FiSUJjZ0FCQkNHaUFBS0FJQUMwRWdjVVVFUUVIYkdrSGZHaUFSUVNCeFFRVjJJZ1ViUWRNYVFkY2FJQVViSUNZZ0ptSWJRUU1nQUJCQ0dnc0NRQ0FRUVlEQUJIRkJnTUFBUncwQUlBMGdDMHdOQUNBS1FVQnJRU0FnRFNBTGF5SUpRWUFDSUFsQmdBSkpJZ1ViRUgwYUlBQW9BZ0FpQjBFZ2NTRUdBa0FnQlVVRVFDQUdSU0VGSUFraEJnTkFJQVZCQVhFRVFDQUtRVUJyUVlBQ0lBQVFRaG9nQUNnQ0FDRUhDeUFIUVNCeElnaEZJUVVnQmtHQWZtb2lCa0gvQVVzTkFBc2dDQTBDSUFsQi93RnhJUWtNQVFzZ0JnMEJDeUFLUVVCcklBa2dBQkJDR2dzZ0RTQUxJQTBnQzBvYklRVU1BUXNnSmlBS1Fld0NhaENHQVNJbUlDYWdJaVpFQUFBQUFBQUFBQUJpQkVBZ0NpQUtLQUxzQWtGL2FqWUM3QUlMSUJGQklISWlGRUhoQUVZRVFDQWJRUWxxSUJzZ0VVRWdjU0lMR3lFU0FrQWdDVUVMU3cwQVFRd2dDV3RGRFFBZ0NVRjBhaUVGUkFBQUFBQUFBREJBSVNjRFFDQW5SQUFBQUFBQUFEQkFvaUVuSUFWQkFXb2lCaUFGVHlFSElBWWhCU0FIRFFBTElCSXRBQUJCTFVZRVFDQW5JQ2FhSUNlaG9Kb2hKZ3dCQ3lBbUlDZWdJQ2VoSVNZTElCa2hCd0pBSUFvb0F1d0NJZ3dnREVFZmRTSUZhaUFGY3lJRkJFQkJBQ0VHQTBBZ0JpQUtha0hQQW1vZ0JTQUZRUXB1SWdkQkNteHJRVEJ5T2dBQUlBWkJmMm9oQmlBRlFRbExJUWdnQnlFRklBZ05BQXNnQmlBS2FrSFFBbW9oQnlBR0RRRUxJQWRCZjJvaUIwRXdPZ0FBQ3lBWFFRSnlJUThnQjBGK2FpSVRJQkZCRDJvNkFBQWdCMEYvYWtFdFFTc2dERUVBU0JzNkFBQWdFRUVJY1NFSElBcEIwQUpxSVFZRFFDQUdJZ1VDZnlBbW1VUUFBQUFBQUFEZ1FXTUVRQ0FtcWd3QkMwR0FnSUNBZUFzaUJrR3dHbW90QUFBZ0MzSTZBQUFnSmlBR3Q2RkVBQUFBQUFBQU1FQ2lJU1lDUUNBRlFRRnFJZ1lnQ2tIUUFtcHJRUUZIRFFBQ1FDQUhEUUFnQ1VFQVNnMEFJQ1pFQUFBQUFBQUFBQUJoRFFFTElBVkJMam9BQVNBRlFRSnFJUVlMSUNaRUFBQUFBQUFBQUFCaURRQUxRWDhoQlVIOS8vLy9CeUFQSUJrZ0Uyc2lEbW9pQjJzZ0NVZ05BU0FISUFsQkFtb2dCaUFLUWRBQ2Ftc2lEQ0FHSUNGcUlBbElHeUFNSUFrYklnbHFJUXNDUUNBUVFZREFCSEVpRUEwQUlBMGdDMHdOQUNBS1FVQnJRU0FnRFNBTGF5SVJRWUFDSUJGQmdBSkpJZ1ViRUgwYUlBQW9BZ0FpQjBFZ2NTRUdBa0FnQlVVRVFDQUdSU0VGSUJFaEJnTkFJQVZCQVhFRVFDQUtRVUJyUVlBQ0lBQVFRaG9nQUNnQ0FDRUhDeUFIUVNCeElnaEZJUVVnQmtHQWZtb2lCa0gvQVVzTkFBc2dDQTBDSUJGQi93RnhJUkVNQVFzZ0JnMEJDeUFLUVVCcklCRWdBQkJDR2dzZ0FDMEFBRUVnY1VVRVFDQVNJQThnQUJCQ0dnc0NRQ0FRUVlDQUJFY05BQ0FOSUF0TURRQWdDa0ZBYTBFd0lBMGdDMnNpRDBHQUFpQVBRWUFDU1NJRkd4QjlHaUFBS0FJQUlnZEJJSEVoQmdKQUlBVkZCRUFnQmtVaEJTQVBJUVlEUUNBRlFRRnhCRUFnQ2tGQWEwR0FBaUFBRUVJYUlBQW9BZ0FoQndzZ0IwRWdjU0lJUlNFRklBWkJnSDVxSWdaQi93RkxEUUFMSUFnTkFpQVBRZjhCY1NFUERBRUxJQVlOQVFzZ0NrRkFheUFQSUFBUVFob0xJQUF0QUFCQklIRkZCRUFnQ2tIUUFtb2dEQ0FBRUVJYUN3SkFJQWtnREdzaUNVRUJTQTBBSUFwQlFHdEJNQ0FKUVlBQ0lBbEJnQUpKSWdVYkVIMGFJQUFvQWdBaUIwRWdjU0VHQWtBZ0JVVUVRQ0FHUlNFRklBa2hCZ05BSUFWQkFYRUVRQ0FLUVVCclFZQUNJQUFRUWhvZ0FDZ0NBQ0VIQ3lBSFFTQnhJZ2hGSVFVZ0JrR0FmbW9pQmtIL0FVc05BQXNnQ0EwQ0lBbEIvd0Z4SVFrTUFRc2dCZzBCQ3lBS1FVQnJJQWtnQUJCQ0dnc2dBQzBBQUVFZ2NVVUVRQ0FUSUE0Z0FCQkNHZ3NDUUNBUVFZREFBRWNOQUNBTklBdE1EUUFnQ2tGQWEwRWdJQTBnQzJzaUNVR0FBaUFKUVlBQ1NTSUZHeEI5R2lBQUtBSUFJZ2RCSUhFaEJnSkFJQVZGQkVBZ0JrVWhCU0FKSVFZRFFDQUZRUUZ4QkVBZ0NrRkFhMEdBQWlBQUVFSWFJQUFvQWdBaEJ3c2dCMEVnY1NJSVJTRUZJQVpCZ0g1cUlnWkIvd0ZMRFFBTElBZ05BaUFKUWY4QmNTRUpEQUVMSUFZTkFRc2dDa0ZBYXlBSklBQVFRaG9MSUEwZ0N5QU5JQXRLR3lFRkRBRUxJQWxCQUVnaEJRSkFJQ1pFQUFBQUFBQUFBQUJoQkVBZ0NpZ0M3QUloQ0F3QkN5QUtJQW9vQXV3Q1FXUnFJZ2cyQXV3Q0lDWkVBQUFBQUFBQXNFR2lJU1lMUVFZZ0NTQUZHeUVPSUFwQjhBSnFJQ0lnQ0VFQVNCc2lFaUVIQTBBZ0J3Si9JQ1pFQUFBQUFBQUE4RUZqSUNaRUFBQUFBQUFBQUFCbWNRUkFJQ2FyREFFTFFRQUxJZ1UyQWdBZ0IwRUVhaUVISUNZZ0JiaWhSQUFBQUFCbHpjMUJvaUltUkFBQUFBQUFBQUFBWWcwQUN3SkFJQWhCQVVnRVFDQUhJUVVnRWlFR0RBRUxJQkloQmdOQUlBaEJIU0FJUVIxSUd5RUlBa0FnQjBGOGFpSUZJQVpKRFFBZ0NLMGhKVUlBSVNRRFFDQUZJQ1JDLy8vLy93K0RJQVUxQWdBZ0pZWjhJaVFnSkVLQWxPdmNBNEFpSkVLQWxPdmNBMzU5UGdJQUlBVkJmR29pQlNBR1R3MEFDeUFrcHlJRlJRMEFJQVpCZkdvaUJpQUZOZ0lBQ3dOQUlBY2lCU0FHU3dSQUlBVkJmR29pQnlnQ0FFVU5BUXNMSUFvZ0NpZ0M3QUlnQ0dzaUNEWUM3QUlnQlNFSElBaEJBRW9OQUFzTElBaEJmMHdFUUNBT1FSbHFRUWx1UVFGcUlSTURRRUVKUVFBZ0NHc2dDRUYzU0JzaENRSkFJQVlnQlU4RVFDQUdJQVpCQkdvZ0JpZ0NBQnNoQmd3QkMwR0FsT3ZjQXlBSmRpRU1RWDhnQ1hSQmYzTWhEMEVBSVFnZ0JpRUhBMEFnQnlBSEtBSUFJZ3NnQ1hZZ0NHbzJBZ0FnQ3lBUGNTQU1iQ0VJSUFkQkJHb2lCeUFGU1EwQUN5QUdJQVpCQkdvZ0JpZ0NBQnNoQmlBSVJRMEFJQVVnQ0RZQ0FDQUZRUVJxSVFVTElBb2dDaWdDN0FJZ0NXb2lDRFlDN0FJZ0VpQUdJQlJCNWdCR0d5SUhJQk5CQW5ScUlBVWdCU0FIYTBFQ2RTQVRTaHNoQlNBSVFRQklEUUFMQzBFQUlRY0NRQ0FHSUFWUERRQWdFaUFHYTBFQ2RVRUpiQ0VISUFZb0FnQWlDMEVLU1EwQVFRb2hDQU5BSUFkQkFXb2hCeUFMSUFoQkNtd2lDRThOQUFzTElBNUJBQ0FISUJSQjVnQkdHeUlMYXlBVVFlY0FSaUlNSUE1QkFFZHhJZzlySWdnZ0JTQVNhMEVDZFVFSmJFRjNha2dFUUNBSVFZRElBR29pRTBFSmJTSVVRUUowSUJKcUloeEJoR0JxSVFsQkNpRUlJQk1nRkVFSmJDSVVhMEVIVEFSQUlBNGdEMnNnQzJzZ0ZHdEIvOGNBYWlFTEEwQWdDRUVLYkNFSUlBdEJBV29pQzBFSFNBMEFDd3NDUUVFQUlBVWdDVUVFYWlJVVJpQUpLQUlBSWc4Z0R5QUliaUlUSUFoc2F5SUxHdzBBQWtBZ0UwRUJjVVVFUUVRQUFBQUFBQUJBUXlFbUlBa2dCazBOQVNBSVFZQ1U2OXdEUncwQklBbEJmR290QUFCQkFYRkZEUUVMUkFFQUFBQUFBRUJESVNZTFJBQUFBQUFBQU9BL1JBQUFBQUFBQVBBL1JBQUFBQUFBQVBnL0lBc2dDRUVCZGlJVFJodEVBQUFBQUFBQStEOGdCU0FVUmhzZ0N5QVRTUnNoSndKQUlCZEZEUUFnR3kwQUFFRXRSdzBBSUNlYUlTY2dKcG9oSmdzZ0NTQVBJQXRySWdzMkFnQWdKaUFub0NBbVlRMEFJQWtnQ0NBTGFpSUhOZ0lBSUFkQmdKVHIzQU5QQkVBZ0hFR0FZR29oQndOQUlBZEJCR3BCQURZQ0FDQUhJQVpKQkVBZ0JrRjhhaUlHUVFBMkFnQUxJQWNnQnlnQ0FFRUJhaUlJTmdJQUlBZEJmR29oQnlBSVFmK1Q2OXdEU3cwQUN5QUhRUVJxSVFrTElCSWdCbXRCQW5WQkNXd2hCeUFHS0FJQUlndEJDa2tOQUVFS0lRZ0RRQ0FIUVFGcUlRY2dDeUFJUVFwc0lnaFBEUUFMQ3lBSlFRUnFJZ2dnQlNBRklBaExHeUVGQ3dKL0EwQkJBQ0FGSWdzZ0JrME5BUm9nQzBGOGFpSUZLQUlBUlEwQUMwRUJDeUVVQWtBZ0RFVUVRQ0FRUVFoeElROE1BUXNnQjBGL2MwRi9JQTVCQVNBT0d5SUZJQWRLSUFkQmUwcHhJZ2diSUFWcUlRNUJmMEYrSUFnYklCRnFJUkVnRUVFSWNTSVBEUUJCQ1NFRkFrQWdGRVVOQUNBTFFYeHFLQUlBSWdsRkRRQkJBQ0VGSUFsQkNuQU5BRUVLSVFnRFFDQUZRUUZxSVFVZ0NTQUlRUXBzSWdod1JRMEFDd3NnQ3lBU2EwRUNkVUVKYkVGM2FpRUlJQkZCSUhKQjVnQkdCRUJCQUNFUElBNGdDQ0FGYXlJRlFRQWdCVUVBU2hzaUJTQU9JQVZJR3lFT0RBRUxRUUFoRHlBT0lBY2dDR29nQldzaUJVRUFJQVZCQUVvYklnVWdEaUFGU0JzaERndEJmeUVGSUE1Qi9mLy8vd2RCL3YvLy93Y2dEaUFQY2lJVEcwb05BQ0FPSUJOQkFFZHFRUUZxSVJ3Q1FDQVJRU0J5UWVZQVJ5SWpSUVJBSUFkQi8vLy8vd2NnSEd0S0RRSWdCMEVBSUFkQkFFb2JJUWNNQVFzZ0dTRUlJQWNnQjBFZmRTSUZhaUFGY3lJRkJFQURRQ0FJUVg5cUlnZ2dCU0FGUVFwdUlnbEJDbXhyUVRCeU9nQUFJQVZCQ1VzaERDQUpJUVVnREEwQUN3c2dHU0FJYTBFQlRBUkFJQWhCZjJvaEJRTkFJQVZCTURvQUFDQVpJQVZySVFnZ0JVRi9haUlKSVFVZ0NFRUNTQTBBQ3lBSlFRRnFJUWdMSUFoQmZtb2lIU0FST2dBQVFYOGhCU0FJUVg5cVFTMUJLeUFIUVFCSUd6b0FBQ0FaSUIxcklnZEIvLy8vL3djZ0hHdEtEUUVMSUFjZ0hHb2lCeUFYUWYvLy8vOEhjMG9OQUNBSElCZHFJUkVDUUNBUVFZREFCSEVpRUEwQUlBMGdFVXdOQUNBS1FVQnJRU0FnRFNBUmF5SU1RWUFDSUF4QmdBSkpJZ1ViRUgwYUlBQW9BZ0FpQ0VFZ2NTRUhBa0FnQlVVRVFDQUhSU0VGSUF3aEJ3TkFJQVZCQVhFRVFDQUtRVUJyUVlBQ0lBQVFRaG9nQUNnQ0FDRUlDeUFJUVNCeElnbEZJUVVnQjBHQWZtb2lCMEgvQVVzTkFBc2dDUTBDSUF4Qi93RnhJUXdNQVFzZ0J3MEJDeUFLUVVCcklBd2dBQkJDR2dzZ0FDMEFBRUVnY1VVRVFDQWJJQmNnQUJCQ0dnc0NRQ0FRUVlDQUJFY05BQ0FOSUJGTURRQWdDa0ZBYTBFd0lBMGdFV3NpREVHQUFpQU1RWUFDU1NJRkd4QjlHaUFBS0FJQUlnaEJJSEVoQndKQUlBVkZCRUFnQjBVaEJTQU1JUWNEUUNBRlFRRnhCRUFnQ2tGQWEwR0FBaUFBRUVJYUlBQW9BZ0FoQ0FzZ0NFRWdjU0lKUlNFRklBZEJnSDVxSWdkQi93RkxEUUFMSUFrTkFpQU1RZjhCY1NFTURBRUxJQWNOQVFzZ0NrRkFheUFNSUFBUVFob0xBa0FnSTBVRVFDQVNJQVlnQmlBU1N4c2lEQ0VKQTBBQ1FDQUpLQUlBSWdWRkJFQkJBQ0VHREFFTFFRQWhCZ05BSUFZZ0gyb2dCU0FGUVFwdUlnZEJDbXhyUVRCeU9nQUFJQVpCZjJvaEJpQUZRUWxMSVFnZ0J5RUZJQWdOQUFzTElBWWdHbW9oQlFKQUlBa2dERWNFUUNBRklBcEIwQUpxVFEwQklBcEIwQUpxUVRBZ0JrRUphaEI5R2lBS1FkQUNhaUVGREFFTElBWU5BQ0FGUVg5cUlnVkJNRG9BQUFzZ0FDMEFBRUVnY1VVRVFDQUZJQm9nQldzZ0FCQkNHZ3NnQ1VFRWFpSUpJQkpORFFBTEFrQWdFMFVOQUNBQUxRQUFRU0J4RFFCQjR4cEJBU0FBRUVJYUN3SkFJQTVCQVVnRVFDQU9JUVVNQVFzZ0NTQUxUd1JBSUE0aEJRd0JDd05BSUJvaEJRSkFJQWtvQWdBaUJnUkFBMEFnQlVGL2FpSUZJQVlnQmtFS2JpSUhRUXBzYTBFd2Nqb0FBQ0FHUVFsTElRZ2dCeUVHSUFnTkFBc2dCU0FLUWRBQ2FrME5BUXNnQ2tIUUFtcEJNQ0FGSUI1cUVIMGFBMEFnQlVGL2FpSUZJQXBCMEFKcVN3MEFDd3NnQUMwQUFFRWdjVVVFUUNBRklBNUJDU0FPUVFsSUd5QUFFRUlhQ3lBT1FYZHFJUVVnRGtFS1NBMEJJQVVoRGlBSlFRUnFJZ2tnQzBrTkFBc0xJQVZCQVVnTkFTQUtRVUJyUVRBZ0JVR0FBaUFGUVlBQ1NTSUdHeEI5R2lBQUtBSUFJZ2hCSUhFaEJ3SkFJQVpGQkVBZ0IwVWhCaUFGSVFjRFFDQUdRUUZ4QkVBZ0NrRkFhMEdBQWlBQUVFSWFJQUFvQWdBaENBc2dDRUVnY1NJTFJTRUdJQWRCZ0g1cUlnZEIvd0ZMRFFBTElBc05BeUFGUWY4QmNTRUZEQUVMSUFjTkFnc2dDa0ZBYXlBRklBQVFRaG9NQVFzQ1FDQU9RUUJJRFFBZ0N5QUdRUVJxSUJRYklRd2dCaUVKQTBBZ0dpRUlBa0FnQ1NnQ0FDSUZCRUJCQUNFSEEwQWdCeUFLYWtIWUFtb2dCU0FGUVFwdUlnaEJDbXhyUVRCeU9nQUFJQWRCZjJvaEJ5QUZRUWxMSVFzZ0NDRUZJQXNOQUFzZ0J5QUtha0haQW1vaENDQUhEUUVMSUFoQmYyb2lDRUV3T2dBQUN3SkFJQVlnQ1VjRVFDQUlJQXBCMEFKcVRRMEJJQXBCMEFKcVFUQWdDQ0FlYWhCOUdnTkFJQWhCZjJvaUNDQUtRZEFDYWtzTkFBc01BUXNnQUMwQUFFRWdjVVVFUUNBSVFRRWdBQkJDR2dzZ0NFRUJhaUVJSUE5RlFRQWdEa0VCU0JzTkFDQUFMUUFBUVNCeERRQkI0eHBCQVNBQUVFSWFDeUFhSUFocklRVWdBQzBBQUVFZ2NVVUVRQ0FJSUFVZ0RpQU9JQVZLR3lBQUVFSWFDeUFKUVFScUlna2dERWxCQUNBT0lBVnJJZzVCZjBvYkRRQUxJQTVCQVVnTkFDQUtRVUJyUVRBZ0RrR0FBaUFPUVlBQ1NTSUZHeEI5R2lBQUtBSUFJZ2RCSUhFaEJnSkFJQVZGQkVBZ0JrVWhCU0FPSVFZRFFDQUZRUUZ4QkVBZ0NrRkFhMEdBQWlBQUVFSWFJQUFvQWdBaEJ3c2dCMEVnY1NJSVJTRUZJQVpCZ0g1cUlnWkIvd0ZMRFFBTElBZ05BaUFPUWY4QmNTRU9EQUVMSUFZTkFRc2dDa0ZBYXlBT0lBQVFRaG9MSUFBdEFBQkJJSEVOQUNBZElCa2dIV3NnQUJCQ0dnc0NRQ0FRUVlEQUFFY05BQ0FOSUJGTURRQWdDa0ZBYTBFZ0lBMGdFV3NpQzBHQUFpQUxRWUFDU1NJRkd4QjlHaUFBS0FJQUlnZEJJSEVoQmdKQUlBVkZCRUFnQmtVaEJTQUxJUVlEUUNBRlFRRnhCRUFnQ2tGQWEwR0FBaUFBRUVJYUlBQW9BZ0FoQndzZ0IwRWdjU0lJUlNFRklBWkJnSDVxSWdaQi93RkxEUUFMSUFnTkFpQUxRZjhCY1NFTERBRUxJQVlOQVFzZ0NrRkFheUFMSUFBUVFob0xJQTBnRVNBTklCRktHeUVGQ3lBRlFRQk9EUW9NQ1F0QkFDRVNRYkFWSVJRTElCWWhCUXdHQ3lBTUlSQWdCaUVKSUFVdEFBQkZEUVVNQmdzZ0FTMEFBU0VGSUFGQkFXb2hBUXdBQ3dBTElBQU5CaUFZUlFSQVFRQWhGUXdIQ3dKL1FRRWdCQ2dDQkNJQlJRMEFHaUFEUVFocUlBRWdBaEI2UVFJZ0JDZ0NDQ0lCUlEwQUdpQURRUkJxSUFFZ0FoQjZRUU1nQkNnQ0RDSUJSUTBBR2lBRFFSaHFJQUVnQWhCNlFRUWdCQ2dDRUNJQlJRMEFHaUFEUVNCcUlBRWdBaEI2UVFVZ0JDZ0NGQ0lCUlEwQUdpQURRU2hxSUFFZ0FoQjZRUVlnQkNnQ0dDSUJSUTBBR2lBRFFUQnFJQUVnQWhCNlFRY2dCQ2dDSENJQlJRMEFHaUFEUVRocUlBRWdBaEI2UVFnZ0JDZ0NJQ0lCUlEwQUdpQURRVUJySUFFZ0FoQjZJQVFvQWlRaUFRMENRUWtMSWdGQmYyb2hCU0FFSUFGQkFuUnFJUUVEUUNBQktBSUFEUUVnQVVFRWFpRUJRUUVoRlNBRlFRRnFJZ1ZCQ0UwTkFBc01CZ3RCbERaQkhEWUNBQXdFQ3lBRFFjZ0FhaUFCSUFJUWVrRUJJUlVNQkFzZ0JTQUlheUlUSUFrZ0NTQVRTQnNpRGtILy8vLy9CeUFTYTBvTkFDQU9JQkpxSWc4Z0RTQU5JQTlJR3lJRklBZEtEUUFDUUNBUVFZREFCSEVpRUEwQUlBOGdEVTROQUNBS1FVQnJRU0FnQlNBUGF5SVJRWUFDSUJGQmdBSkpJZ1liRUgwYUlBQW9BZ0FpQzBFZ2NTRUhBa0FnQmtVRVFDQUhSU0VHSUJFaEJ3TkFJQVpCQVhFRVFDQUtRVUJyUVlBQ0lBQVFRaG9nQUNnQ0FDRUxDeUFMUVNCeElneEZJUVlnQjBHQWZtb2lCMEgvQVVzTkFBc2dEQTBDSUJGQi93RnhJUkVNQVFzZ0J3MEJDeUFLUVVCcklCRWdBQkJDR2dzZ0FDMEFBRUVnY1VVRVFDQVVJQklnQUJCQ0dnc0NRQ0FRUVlDQUJFY05BQ0FQSUExT0RRQWdDa0ZBYTBFd0lBVWdEMnNpRWtHQUFpQVNRWUFDU1NJR0d4QjlHaUFBS0FJQUlndEJJSEVoQndKQUlBWkZCRUFnQjBVaEJpQVNJUWNEUUNBR1FRRnhCRUFnQ2tGQWEwR0FBaUFBRUVJYUlBQW9BZ0FoQ3dzZ0MwRWdjU0lNUlNFR0lBZEJnSDVxSWdkQi93RkxEUUFMSUF3TkFpQVNRZjhCY1NFU0RBRUxJQWNOQVFzZ0NrRkFheUFTSUFBUVFob0xBa0FnRXlBSlRnMEFJQXBCUUd0Qk1DQU9JQk5ySWd4QmdBSWdERUdBQWtraUJoc1FmUm9nQUNnQ0FDSUxRU0J4SVFjQ1FDQUdSUVJBSUFkRklRWWdEQ0VIQTBBZ0JrRUJjUVJBSUFwQlFHdEJnQUlnQUJCQ0dpQUFLQUlBSVFzTElBdEJJSEVpQ1VVaEJpQUhRWUIrYWlJSFFmOEJTdzBBQ3lBSkRRSWdERUgvQVhFaERBd0JDeUFIRFFFTElBcEJRR3NnRENBQUVFSWFDeUFBTFFBQVFTQnhSUVJBSUFnZ0V5QUFFRUlhQ3lBUVFZREFBRWNOQVNBUElBMU9EUUVnQ2tGQWEwRWdJQVVnRDJzaURVR0FBaUFOUVlBQ1NTSUdHeEI5R2lBQUtBSUFJZ2hCSUhFaEJ3SkFJQVpGQkVBZ0IwVWhCaUFOSVFjRFFDQUdRUUZ4QkVBZ0NrRkFhMEdBQWlBQUVFSWFJQUFvQWdBaENBc2dDRUVnY1NJTFJTRUdJQWRCZ0g1cUlnZEIvd0ZMRFFBTElBc05BeUFOUWY4QmNTRU5EQUVMSUFjTkFnc2dDa0ZBYXlBTklBQVFRaG9NQVFzTFFaUTJRVDAyQWdBTFFYOGhGUXNnQ2tId0Jtb2tBQ0FWQzc4RUFDQUJRWGRxSWdGQkVVMEVRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQ0FCUVFGckRoRUFBUVFDQXdVR0J3Z0pDZ3NNRFE0UEVCRUxJQUlnQWlnQ0FDSUJRUVJxTmdJQUlBQWdBVFFDQURjREFBOExJQUlnQWlnQ0FDSUJRUVJxTmdJQUlBQWdBVFVDQURjREFBOExJQUlnQWlnQ0FDSUJRUVJxTmdJQUlBQWdBVFFDQURjREFBOExJQUlnQWlnQ0FDSUJRUVJxTmdJQUlBQWdBVFVDQURjREFBOExJQUlnQWlnQ0FFRUhha0Y0Y1NJQlFRaHFOZ0lBSUFBZ0FTa0RBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FUSUJBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FUTUJBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FUQUFBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FURUFBRGNEQUE4TElBSWdBaWdDQUVFSGFrRjRjU0lCUVFocU5nSUFJQUFnQVNrREFEY0RBQThMSUFJZ0FpZ0NBQ0lCUVFScU5nSUFJQUFnQVRVQ0FEY0RBQThMSUFJZ0FpZ0NBRUVIYWtGNGNTSUJRUWhxTmdJQUlBQWdBU2tEQURjREFBOExJQUlnQWlnQ0FFRUhha0Y0Y1NJQlFRaHFOZ0lBSUFBZ0FTa0RBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FUUUNBRGNEQUE4TElBSWdBaWdDQUNJQlFRUnFOZ0lBSUFBZ0FUVUNBRGNEQUE4TElBSWdBaWdDQUVFSGFrRjRjU0lCUVFocU5nSUFJQUFnQVNrREFEY0RBQThMUWFBWlFiQXhFSGNhQUFzZ0FpQUNLQUlBSWdGQkJHbzJBZ0FnQUNBQktBSUFOZ0lBQ3dzWkFDQUFFRTRpQUVVRVFFRUFEd3RCbERZZ0FEWUNBRUYvQ3drQUlBQW9BamdRZXd2OEFnSUNmd0YrQWtBZ0FrVU5BQ0FBSUFFNkFBQWdBQ0FDYWlJRFFYOXFJQUU2QUFBZ0FrRURTUTBBSUFBZ0FUb0FBaUFBSUFFNkFBRWdBMEY5YWlBQk9nQUFJQU5CZm1vZ0FUb0FBQ0FDUVFkSkRRQWdBQ0FCT2dBRElBTkJmR29nQVRvQUFDQUNRUWxKRFFBZ0FFRUFJQUJyUVFOeElnUnFJZ01nQVVIL0FYRkJnWUtFQ0d3aUFUWUNBQ0FESUFJZ0JHdEJmSEVpQkdvaUFrRjhhaUFCTmdJQUlBUkJDVWtOQUNBRElBRTJBZ2dnQXlBQk5nSUVJQUpCZUdvZ0FUWUNBQ0FDUVhScUlBRTJBZ0FnQkVFWlNRMEFJQU1nQVRZQ0dDQURJQUUyQWhRZ0F5QUJOZ0lRSUFNZ0FUWUNEQ0FDUVhCcUlBRTJBZ0FnQWtGc2FpQUJOZ0lBSUFKQmFHb2dBVFlDQUNBQ1FXUnFJQUUyQWdBZ0JDQURRUVJ4UVJoeUlnUnJJZ0pCSUVrTkFDQUJyU0lGUWlDR0lBV0VJUVVnQXlBRWFpRUJBMEFnQVNBRk53TUFJQUZCR0dvZ0JUY0RBQ0FCUVJCcUlBVTNBd0FnQVVFSWFpQUZOd01BSUFGQklHb2hBU0FDUVdCcUlnSkJIMHNOQUFzTElBQUxGd0VCZnlBQVFRQWdBUkNCQVNJQ0lBQnJJQUVnQWhzTGtnc0JDSDhDUUFKQUlBSkZEUUFnQVVFRGNVVU5BQ0FBSVFNRFFDQURJQUV0QUFBNkFBQWdBa0YvYWlFRUlBTkJBV29oQXlBQlFRRnFJUUVnQWtFQlJnMENJQVFoQWlBQlFRTnhEUUFMREFFTElBSWhCQ0FBSVFNTEFrQWdBMEVEY1NJQ1JRUkFBa0FnQkVFUVNRUkFJQVFoQWd3QkN5QUVRWEJxSVFJRFFDQURJQUVvQWdBMkFnQWdBMEVFYWlBQlFRUnFLQUlBTmdJQUlBTkJDR29nQVVFSWFpZ0NBRFlDQUNBRFFReHFJQUZCREdvb0FnQTJBZ0FnQTBFUWFpRURJQUZCRUdvaEFTQUVRWEJxSWdSQkQwc05BQXNMSUFKQkNIRUVRQ0FESUFFcEFnQTNBZ0FnQTBFSWFpRURJQUZCQ0dvaEFRc2dBa0VFY1FSQUlBTWdBU2dDQURZQ0FDQURRUVJxSVFNZ0FVRUVhaUVCQ3lBQ1FRSnhCRUFnQXlBQkxRQUFPZ0FBSUFNZ0FTMEFBVG9BQVNBRFFRSnFJUU1nQVVFQ2FpRUJDeUFDUVFGeFJRMEJJQU1nQVMwQUFEb0FBQ0FBRHdzQ1FDQUVRU0JKRFFBZ0FrRi9haUlDUVFKTERRQUNRQUpBQWtBZ0FrRUJhdzRDQVFJQUN5QURJQUV0QUFFNkFBRWdBeUFCS0FJQUlnVTZBQUFnQXlBQkxRQUNPZ0FDSUFSQmZXb2hDQ0FEUVFOcUlRa2dCRUZzYWtGd2NTRUtRUUFoQWdOQUlBSWdDV29pQXlBQklBSnFJZ1pCQkdvb0FnQWlCMEVJZENBRlFSaDJjallDQUNBRFFRUnFJQVpCQ0dvb0FnQWlCVUVJZENBSFFSaDJjallDQUNBRFFRaHFJQVpCREdvb0FnQWlCMEVJZENBRlFSaDJjallDQUNBRFFReHFJQVpCRUdvb0FnQWlCVUVJZENBSFFSaDJjallDQUNBQ1FSQnFJUUlnQ0VGd2FpSUlRUkJMRFFBTElBSWdDV29oQXlBQklBSnFRUU5xSVFFZ0JDQUthMEZ0YWlFRURBSUxJQU1nQVNnQ0FDSUZPZ0FBSUFNZ0FTMEFBVG9BQVNBRVFYNXFJUWdnQTBFQ2FpRUpJQVJCYkdwQmNIRWhDa0VBSVFJRFFDQUNJQWxxSWdNZ0FTQUNhaUlHUVFScUtBSUFJZ2RCRUhRZ0JVRVFkbkkyQWdBZ0EwRUVhaUFHUVFocUtBSUFJZ1ZCRUhRZ0IwRVFkbkkyQWdBZ0EwRUlhaUFHUVF4cUtBSUFJZ2RCRUhRZ0JVRVFkbkkyQWdBZ0EwRU1haUFHUVJCcUtBSUFJZ1ZCRUhRZ0IwRVFkbkkyQWdBZ0FrRVFhaUVDSUFoQmNHb2lDRUVSU3cwQUN5QUNJQWxxSVFNZ0FTQUNha0VDYWlFQklBUWdDbXRCYm1vaEJBd0JDeUFESUFFb0FnQWlCVG9BQUNBRVFYOXFJUWdnQTBFQmFpRUpJQVJCYkdwQmNIRWhDa0VBSVFJRFFDQUNJQWxxSWdNZ0FTQUNhaUlHUVFScUtBSUFJZ2RCR0hRZ0JVRUlkbkkyQWdBZ0EwRUVhaUFHUVFocUtBSUFJZ1ZCR0hRZ0IwRUlkbkkyQWdBZ0EwRUlhaUFHUVF4cUtBSUFJZ2RCR0hRZ0JVRUlkbkkyQWdBZ0EwRU1haUFHUVJCcUtBSUFJZ1ZCR0hRZ0IwRUlkbkkyQWdBZ0FrRVFhaUVDSUFoQmNHb2lDRUVTU3cwQUN5QUNJQWxxSVFNZ0FTQUNha0VCYWlFQklBUWdDbXRCYjJvaEJBc2dCRUVRY1FSQUlBTWdBUzhBQURzQUFDQURJQUV0QUFJNkFBSWdBeUFCTFFBRE9nQURJQU1nQVMwQUJEb0FCQ0FESUFFdEFBVTZBQVVnQXlBQkxRQUdPZ0FHSUFNZ0FTMEFCem9BQnlBRElBRXRBQWc2QUFnZ0F5QUJMUUFKT2dBSklBTWdBUzBBQ2pvQUNpQURJQUV0QUFzNkFBc2dBeUFCTFFBTU9nQU1JQU1nQVMwQURUb0FEU0FESUFFdEFBNDZBQTRnQXlBQkxRQVBPZ0FQSUFOQkVHb2hBeUFCUVJCcUlRRUxJQVJCQ0hFRVFDQURJQUV0QUFBNkFBQWdBeUFCTFFBQk9nQUJJQU1nQVMwQUFqb0FBaUFESUFFdEFBTTZBQU1nQXlBQkxRQUVPZ0FFSUFNZ0FTMEFCVG9BQlNBRElBRXRBQVk2QUFZZ0F5QUJMUUFIT2dBSElBTkJDR29oQXlBQlFRaHFJUUVMSUFSQkJIRUVRQ0FESUFFdEFBQTZBQUFnQXlBQkxRQUJPZ0FCSUFNZ0FTMEFBam9BQWlBRElBRXRBQU02QUFNZ0EwRUVhaUVESUFGQkJHb2hBUXNnQkVFQ2NRUkFJQU1nQVMwQUFEb0FBQ0FESUFFdEFBRTZBQUVnQTBFQ2FpRURJQUZCQW1vaEFRc2dCRUVCY1VVTkFDQURJQUV0QUFBNkFBQUxJQUFMckFFQkEzOENRQUpBQWtBZ0FDSUJRUU54UlEwQUlBQXRBQUJGQkVCQkFBOExJQUJCQVdvaEFRTkFJQUZCQTNGRkRRRWdBUzBBQUNFQ0lBRkJBV29pQXlFQklBSU5BQXNNQVFzZ0FVRjhhaUVCQTBBZ0FVRUVhaUlCS0FJQUlnSkJmM01nQWtILy9mdDNhbkZCZ0lHQ2hIaHhSUTBBQ3lBQ1FmOEJjVVVFUUNBQklBQnJEd3NEUUNBQkxRQUJJUUlnQVVFQmFpSURJUUVnQWcwQUN3d0JDeUFEUVg5cUlRTUxJQU1nQUdzTG93SUJCSDhnQWtFQVJ5RUVBa0FDUUFKQUlBSkZCRUFnQWlFRERBRUxJQUJCQTNGRkJFQWdBaUVEREFFTElBRkIvd0Z4SVFVRFFDQUZJQUF0QUFCR0JFQWdBaUVEREFNTElBSkJBVWNoQkNBQ1FYOXFJUU1nQUVFQmFpRUFJQUpCQVVZTkFTQURJUUlnQUVFRGNRMEFDd3NnQkVVTkFRc0NRQ0FBTFFBQUlBRkIvd0Z4UmcwQUlBTkJCRWtOQUNBQlFmOEJjVUdCZ29RSWJDRUVJQU5CZkdvaUFrRURjU0VGSUFKQmZIRWdBR3BCQkdvaEJnTkFJQUFvQWdBZ0JITWlBa0YvY3lBQ1FmLzkrM2RxY1VHQWdZS0VlSEVOQVNBQVFRUnFJUUFnQTBGOGFpSURRUU5MRFFBTElBVWhBeUFHSVFBTElBTkZEUUFnQVVIL0FYRWhBZ05BSUFJZ0FDMEFBRVlFUUNBQUR3c2dBRUVCYWlFQUlBTkJmMm9pQXcwQUN3dEJBQXNFQUNBQUN5Z0JBWDhnQUNFQlFjQTJLQUlBSWdBRWZ5QUFCVUhBTmtHb05qWUNBRUdvTmdzb0FoUWFJQUVMRkFBZ0FFVUVRRUVBRHdzZ0FDQUJRUUFRaFFFTG13SUFRUUVoQWlBQUJIOGdBVUgvQUUwRVFDQUFJQUU2QUFCQkFROExBa0JCcURZb0FnQkZCRUFnQVVHQWYzRkJnTDhEUndSQVFaUTJRUmsyQWdBTUFnc2dBQ0FCT2dBQVFRRVBDeUFCUWY4UFRRUkFJQUFnQVVFL2NVR0FBWEk2QUFFZ0FDQUJRUVoyUWNBQmNqb0FBRUVDRHdzZ0FVR0FzQU5QUVFBZ0FVR0FRSEZCZ01BRFJ4dEZCRUFnQUNBQlFUOXhRWUFCY2pvQUFpQUFJQUZCREhaQjRBRnlPZ0FBSUFBZ0FVRUdka0UvY1VHQUFYSTZBQUZCQXc4TElBRkJnSUI4YWtILy96OU5CRUFnQUNBQlFUOXhRWUFCY2pvQUF5QUFJQUZCRW5aQjhBRnlPZ0FBSUFBZ0FVRUdka0UvY1VHQUFYSTZBQUlnQUNBQlFReDJRVDl4UVlBQmNqb0FBVUVFRHd0QmxEWkJHVFlDQUF0QmZ3VWdBZ3NMaGdFQ0FYOEJmaUFBdlNJRFFqU0lwMEgvRDNFaUFrSC9EMGNFZkNBQ1JRUkFJQUJFQUFBQUFBQUFBQUJoQkVBZ0FVRUFOZ0lBSUFBUEN5QUFSQUFBQUFBQUFQQkRvaUFCRUlZQklRQWdBU0FCS0FJQVFVQnFOZ0lBSUFBUEN5QUJJQUpCZ25ocU5nSUFJQU5DLy8vLy8vLy8vNGVBZjROQ2dJQ0FnSUNBZ1BBL2hMOEZJQUFMQzA4QkFYd2dBQ0FBb2lJQVJJRmVEUDMvLzkrL29rUUFBQUFBQUFEd1A2QWdBQ0FBb2lJQlJFSTZCZUZUVmFVL29xQWdBQ0FCb2lBQVJHbFE3dUJDay9rK29rUW5IZy9vaDhCV3Y2Q2lvTFlMU3dFQ2ZDQUFJQUNpSWdFZ0FLSWlBaUFCSUFHaW9pQUJSS2RHTzR5SHpjWStva1IwNThyaStRQXF2NkNpSUFJZ0FVU3krMjZKRUJHQlA2SkVkNnpMVkZWVnhiK2dvaUFBb0tDMkM2Z0JBQUpBSUFGQmdBaE9CRUFnQUVRQUFBQUFBQURnZjZJaEFDQUJRZjhQU0FSQUlBRkJnWGhxSVFFTUFnc2dBRVFBQUFBQUFBRGdmNkloQUNBQlFmMFhJQUZCL1JkSUcwR0NjR29oQVF3QkN5QUJRWUY0U2cwQUlBQkVBQUFBQUFBQVlBT2lJUUFnQVVHNGNFb0VRQ0FCUWNrSGFpRUJEQUVMSUFCRUFBQUFBQUFBWUFPaUlRQWdBVUh3YUNBQlFmQm9TaHRCa2c5cUlRRUxJQUFnQVVIL0IycXRRalNHdjZJTGp4TUNFbjhFZkNNQVFiQUVheUlISkFBZ0FpQUNRWDFxUVJodElnWkJBQ0FHUVFCS0d5SVFRV2hzYWlFT0lBUkJBblJCOEJwcUtBSUFJZzBnQTBGL2FpSUNha0VBVGdSQUlBTWdEV29oQ1NBUUlBSnJJUUlnRUNBRGEwRUNkRUdFRzJvaENDQUhRY0FDYWlFR0EwQWdCaUFDUVFCSUJIeEVBQUFBQUFBQUFBQUZJQWdvQWdDM0N6a0RBQ0FHUVFocUlRWWdDRUVFYWlFSUlBSkJBV29oQWlBSlFYOXFJZ2tOQUFzTElBNUJhR29oQ3lBRFFRTjBJQWRxUWJnQ2FpRUpJQU5CQVVnaENnTkFSQUFBQUFBQUFBQUFJUmNnQ2tVRVFDQUFJUUlnQXlFSUlBa2hCZ05BSUJjZ0Fpc0RBQ0FHS3dNQW9xQWhGeUFDUVFocUlRSWdCa0Y0YWlFR0lBaEJmMm9pQ0EwQUN3c2dCeUFGUVFOMGFpQVhPUU1BSUFsQkNHb2hDU0FGSUExSUlRSWdCVUVCYWlFRklBSU5BQXRCRnlBTGF5RVNRUmdnQzJzaEVTQU5RUUowSUFkcVFkd0RhaUVUSUFkQjNBTnFJUlFnQjBGNGFpRVZJQTBoQlFKQUEwQWdCeUFGUVFOMElnSnFLd01BSVJjZ0JVRUJTQ0lLUlFSQUlBVkJBV29oQ0NBQ0lCVnFJUUlnQjBIZ0Eyb2hCZ05BSUFZQ2Z5QVhBbjhnRjBRQUFBQUFBQUJ3UHFJaUdKbEVBQUFBQUFBQTRFRmpCRUFnR0tvTUFRdEJnSUNBZ0hnTHR5SVlSQUFBQUFBQUFIREJvcUFpRjVsRUFBQUFBQUFBNEVGakJFQWdGNm9NQVF0QmdJQ0FnSGdMTmdJQUlBWkJCR29oQmlBQ0t3TUFJQmlnSVJjZ0FrRjRhaUVDSUFoQmYyb2lDRUVCU2cwQUN3c0NmeUFYSUFzUWlRRWlGeUFYUkFBQUFBQUFBTUEvb3B4RUFBQUFBQUFBSU1DaW9DSVhtVVFBQUFBQUFBRGdRV01FUUNBWHFnd0JDMEdBZ0lDQWVBc2hEeUFYSUErM29TRVhBa0FDUUFKQUFuOGdDMEVCU0NJV1JRUkFJQVZCQW5RZ0IycEIzQU5xSWdJZ0FpZ0NBQ0lDSUFJZ0VYVWlBaUFSZEdzaUJqWUNBQ0FDSUE5cUlROGdCaUFTZFF3QkN5QUxEUUVnQlVFQ2RDQUhha0hjQTJvb0FnQkJGM1VMSWd4QkFVZ05BZ3dCQzBFQ0lRd2dGMFFBQUFBQUFBRGdQMlpCQVhORkRRQkJBQ0VNREFFTEFrQWdDZ1JBUVFBaENnd0JDMEVBSVFvZ0IwSGdBMm9oQWlBRklRa0RRQ0FDS0FJQUlRWkIvLy8vQnlFSUFrQUNRQ0FDSUFvRWZ5QUlCU0FHUlEwQlFRRWhDa0dBZ0lBSUN5QUdhellDQUF3QkMwRUFJUW9MSUFKQkJHb2hBaUFKUVg5cUlna05BQXNMQWtBZ0ZnMEFJQXRCZjJvaUFrRUJTdzBBSUFKQkFXc0VRQ0FGUVFKMElBZHFRZHdEYWlJQ0lBSW9BZ0JCLy8vL0EzRTJBZ0FNQVFzZ0JVRUNkQ0FIYWtIY0Eyb2lBaUFDS0FJQVFmLy8vd0Z4TmdJQUN5QVBRUUZxSVE4Z0RFRUNSdzBBUkFBQUFBQUFBUEEvSUJlaElSZEJBaUVNSUFwRkRRQWdGMFFBQUFBQUFBRHdQeUFMRUlrQm9TRVhDeUFYUkFBQUFBQUFBQUFBWVFSQUFrQWdCU0FOVEEwQUlCUWdCVUVDZEdvaEFrRUFJUVlnQlNFSUEwQWdBaWdDQUNBR2NpRUdJQUpCZkdvaEFpQUlRWDlxSWdnZ0RVb05BQXNnQmtVTkFDQUZRUUowSUFkcVFkd0RhaUVDSUFzaERnTkFJQVZCZjJvaEJTQU9RV2hxSVE0Z0FpZ0NBQ0VHSUFKQmZHb2hBaUFHUlEwQUN3d0RDeUFUSVFJZ0JTRUpBMEFnQ1VFQmFpRUpJQUlvQWdBaEJpQUNRWHhxSVFJZ0JrVU5BQXNnQjBIQUFtb2dBeUFGYWtFRGRHb2hDZ05BSUFkQndBSnFJQU1nQldwQkEzUnFJQVZCQVdvaUJTQVFha0VDZEVHQUcyb29BZ0MzT1FNQVJBQUFBQUFBQUFBQUlSY2dBMEVCVGdSQUlBQWhBaUFLSVFZZ0F5RUlBMEFnRnlBQ0t3TUFJQVlyQXdDaW9DRVhJQUpCQ0dvaEFpQUdRWGhxSVFZZ0NFRi9haUlJRFFBTEN5QUhJQVZCQTNScUlCYzVBd0FnQ2tFSWFpRUtJQVVnQ1VnTkFBc2dDU0VGREFFTEN3SkFJQmRCQUNBTGF4Q0pBU0lYUkFBQUFBQUFBSEJCWmtFQmMwVUVRQ0FIUWVBRGFpQUZRUUowYWdKL0lCY0NmeUFYUkFBQUFBQUFBSEErb2lJWW1VUUFBQUFBQUFEZ1FXTUVRQ0FZcWd3QkMwR0FnSUNBZUFzaUFyZEVBQUFBQUFBQWNNR2lvQ0lYbVVRQUFBQUFBQURnUVdNRVFDQVhxZ3dCQzBHQWdJQ0FlQXMyQWdBZ0JVRUJhaUVGREFFTEFuOGdGNWxFQUFBQUFBQUE0RUZqQkVBZ0Y2b01BUXRCZ0lDQWdIZ0xJUUlnQ3lFT0N5QUhRZUFEYWlBRlFRSjBhaUFDTmdJQUN3SkFJQVZCQUVnTkFDQUZRUUZxSVFoRUFBQUFBQUFBOEQ4Z0RoQ0pBU0VYSUFkQjRBTnFJQVZCQW5ScUlRSWdCeUFGUVFOMGFpRUdBMEFnQmlBWElBSW9BZ0Mzb2prREFDQUNRWHhxSVFJZ0JrRjRhaUVHSUJkRUFBQUFBQUFBY0Q2aUlSY2dDRUYvYWlJSVFRQktEUUFMSUFWQkFFZ05BQ0FISUFWQkEzUnFJUWtnQlNFQ0EwQWdCU0FDSWdwcklRTkVBQUFBQUFBQUFBQWhGMEVBSVFKQkFDRUdBMEFDUUNBWElBSkIwREJxS3dNQUlBSWdDV29yQXdDaW9DRVhJQVlnRFU0TkFDQUNRUWhxSVFJZ0JpQURTU0VJSUFaQkFXb2hCaUFJRFFFTEN5QUhRYUFCYWlBRFFRTjBhaUFYT1FNQUlBbEJlR29oQ1NBS1FYOXFJUUlnQ2tFQVNnMEFDd3NDUUNBRVFRTkxEUUFDUUFKQUFrQUNRQ0FFUVFGckRnTUNBZ0FCQ3dKQUlBVkJBVWdOQUNBRlFRRnFJUVlnQjBHZ0FXb2dCVUVEZEdvaUNFRjRhaUVDSUFnckF3QWhGd05BSUFJZ0Fpc0RBQ0lhSUJlZ0loZzVBd0FnQWtFSWFpQVhJQm9nR0tHZ09RTUFJQUpCZUdvaEFpQVlJUmNnQmtGL2FpSUdRUUZLRFFBTElBVkJBa2dOQUNBRlFRRnFJUVlnQjBHZ0FXb2dCVUVEZEdvaUNFRjRhaUVDSUFnckF3QWhGd05BSUFJZ0Fpc0RBQ0lhSUJlZ0loZzVBd0FnQWtFSWFpQVhJQm9nR0tHZ09RTUFJQUpCZUdvaEFpQVlJUmNnQmtGL2FpSUdRUUpLRFFBTElBVkJBa2dOQUNBRlFRRnFJUVlnQjBHZ0FXb2dCVUVEZEdvaEFnTkFJQmtnQWlzREFLQWhHU0FDUVhocUlRSWdCa0YvYWlJR1FRSktEUUFMQ3lBSEt3T2dBU0VYSUF3TkFpQUJJQmM1QXdBZ0FTQVpPUU1RSUFFZ0J5a0RxQUUzQXdnTUF3c0NRQ0FGUVFCSUJFQkVBQUFBQUFBQUFBQWhGd3dCQ3lBRlFRRnFJUVlnQjBHZ0FXb2dCVUVEZEdvaEFrUUFBQUFBQUFBQUFDRVhBMEFnRnlBQ0t3TUFvQ0VYSUFKQmVHb2hBaUFHUVg5cUlnWkJBRW9OQUFzTElBRWdGNW9nRnlBTUd6a0RBQXdDQ3dKQUlBVkJBRWdFUUVRQUFBQUFBQUFBQUNFWERBRUxJQVZCQVdvaEJpQUhRYUFCYWlBRlFRTjBhaUVDUkFBQUFBQUFBQUFBSVJjRFFDQVhJQUlyQXdDZ0lSY2dBa0Y0YWlFQ0lBWkJmMm9pQmtFQVNnMEFDd3NnQVNBWG1pQVhJQXdiT1FNQUlBY3JBNkFCSUJlaElSY2dCVUVCVGdSQUlBZEJvQUZxUVFoeUlRSURRQ0FYSUFJckF3Q2dJUmNnQWtFSWFpRUNJQVZCZjJvaUJRMEFDd3NnQVNBWG1pQVhJQXdiT1FNSURBRUxJQUVnRjVvNUF3QWdBU0FabWprREVDQUJJQWNyQTZnQm1qa0RDQXNnQjBHd0JHb2tBQ0FQUVFkeEM0WUNBZ04vQVh3akFFRVFheUlESkFBQ1FDQUF2Q0lFUWYvLy8vOEhjU0lDUWRxZnBPNEVUUVJBSUFFZ0FMc2lCU0FGUklQSXlXMHdYK1Evb2tRQUFBQUFBQUE0UTZCRUFBQUFBQUFBT01PZ0lnVkVBQUFBVVBzaCtiK2lvQ0FGUkdOaUdtRzBFRkcrb3FBNUF3QWdCWmxFQUFBQUFBQUE0RUZqQkVBZ0Jhb2hBZ3dDQzBHQWdJQ0FlQ0VDREFFTElBSkJnSUNBL0FkUEJFQWdBU0FBSUFDVHV6a0RBRUVBSVFJTUFRc2dBeUFDSUFKQkYzWkI2bjVxSWdKQkYzUnJ2cnM1QXdnZ0EwRUlhaUFESUFKQkFVRUFFSW9CSVFJZ0F5c0RBQ0VGSUFSQmYwd0VRQ0FCSUFXYU9RTUFRUUFnQW1zaEFnd0JDeUFCSUFVNUF3QUxJQU5CRUdva0FDQUNDL3dDQWdOL0FYd2pBRUVRYXlJQ0pBQUNmU0FBdkNJRFFmLy8vLzhIY1NJQlFkcWZwUG9EVFFSQVF3QUFnRDhnQVVHQWdJRE1BMGtOQVJvZ0FMc1Fod0VNQVFzZ0FVSFJwKzJEQkUwRVFDQUF1eUVFSUFGQjVKZmJnQVJQQkVCRUdDMUVWUHNoQ1VCRUdDMUVWUHNoQ2NBZ0EwRUFTQnNnQktBUWh3R01EQUlMSUFOQmYwd0VRQ0FFUkJndFJGVDdJZmsvb0JDSUFRd0NDMFFZTFVSVSt5SDVQeUFFb1JDSUFRd0JDeUFCUWRYamlJY0VUUVJBSUFGQjROdS9oUVJQQkVCRUdDMUVWUHNoR1VCRUdDMUVWUHNoR2NBZ0EwRUFTQnNnQUx1Z0VJY0JEQUlMSUFOQmYwd0VRRVRTSVROL2ZOa1N3Q0FBdTZFUWlBRU1BZ3NnQUx0RTBpRXpmM3paRXNDZ0VJZ0JEQUVMSUFBZ0FKTWdBVUdBZ0lEOEIwOE5BQm9nQUNBQ1FRaHFFSXNCUVFOeElnRkJBazBFUUFKQUFrQUNRQ0FCUVFGckRnSUJBZ0FMSUFJckF3Z1Fod0VNQXdzZ0Fpc0RDSm9RaUFFTUFnc2dBaXNEQ0JDSEFZd01BUXNnQWlzRENCQ0lBUXNoQUNBQ1FSQnFKQUFnQUF1U0F3SURmd0Y4SXdCQkVHc2lBaVFBQWtBZ0FMd2lBMEgvLy8vL0IzRWlBVUhhbjZUNkEwMEVRQ0FCUVlDQWdNd0RTUTBCSUFDN0VJZ0JJUUFNQVFzZ0FVSFJwKzJEQkUwRVFDQUF1eUVFSUFGQjQ1ZmJnQVJOQkVBZ0EwRi9UQVJBSUFSRUdDMUVWUHNoK1QrZ0VJY0JqQ0VBREFNTElBUkVHQzFFVlBzaCtiK2dFSWNCSVFBTUFndEVHQzFFVlBzaENVQkVHQzFFVlBzaENjQWdBMEVBU0JzZ0JLQ2FFSWdCSVFBTUFRc2dBVUhWNDRpSEJFMEVRQ0FBdXlFRUlBRkIzOXUvaFFSTkJFQWdBMEYvVEFSQUlBUkUwaUV6ZjN6WkVrQ2dFSWNCSVFBTUF3c2dCRVRTSVROL2ZOa1N3S0FRaHdHTUlRQU1BZ3RFR0MxRVZQc2hHVUJFR0MxRVZQc2hHY0FnQTBFQVNCc2dCS0FRaUFFaEFBd0JDeUFCUVlDQWdQd0hUd1JBSUFBZ0FKTWhBQXdCQ3lBQUlBSkJDR29RaXdGQkEzRWlBVUVDVFFSQUFrQUNRQUpBSUFGQkFXc09BZ0VDQUFzZ0Fpc0RDQkNJQVNFQURBTUxJQUlyQXdnUWh3RWhBQXdDQ3lBQ0t3TUltaENJQVNFQURBRUxJQUlyQXdnUWh3R01JUUFMSUFKQkVHb2tBQ0FBQzdVREFRUi9Ba0FnQUNBQlJnMEFJQUVnQUdzZ0FtdEJBQ0FDUVFGMGEwMEVRQ0FBSUFFZ0FoQi9HZ3dCQ3lBQUlBRnpRUU54SVFNQ1FBSkFJQUFnQVVrRVFDQURCRUFnQUNFRERBTUxJQUJCQTNGRkJFQWdBQ0VEREFJTElBQWhBd05BSUFKRkRRUWdBeUFCTFFBQU9nQUFJQUZCQVdvaEFTQUNRWDlxSVFJZ0EwRUJhaUlEUVFOeERRQUxEQUVMQWtBZ0F3UkFJQUloQXd3QkN3SkFJQUFnQW1wQkEzRkZCRUFnQWlFRERBRUxJQUZCZjJvaEJTQUFRWDlxSVFZRFFDQUNSUTBGSUFJZ0Jtb2lCQ0FDSUFWcUxRQUFPZ0FBSUFKQmYyb2lBeUVDSUFSQkEzRU5BQXNMSUFOQkJFa05BQ0FBUVh4cUlRSWdBVUY4YWlFRUEwQWdBaUFEYWlBRElBUnFLQUlBTmdJQUlBTkJmR29pQTBFRFN3MEFDd3NnQTBVTkFpQUJRWDlxSVFFZ0FFRi9haUVDQTBBZ0FpQURhaUFCSUFOcUxRQUFPZ0FBSUFOQmYyb2lBdzBBQ3d3Q0N5QUNRUVJKRFFBZ0FpRUVBMEFnQXlBQktBSUFOZ0lBSUFGQkJHb2hBU0FEUVFScUlRTWdCRUY4YWlJRVFRTkxEUUFMSUFKQkEzRWhBZ3NnQWtVTkFBTkFJQU1nQVMwQUFEb0FBQ0FEUVFGcUlRTWdBVUVCYWlFQklBSkJmMm9pQWcwQUN3c2dBQXVZQkFNRmZ3UjlBM3dnQTBFQU5nSUFJQUFnQVVnRVFFRUREd3NnQWtFQlNBUkFRUU1QQ3dKQVFRRkJIQkF6SWdRRWZ5QUVRWUFRTmdJWUlBUWdBa0VCZENJR05nSUFJQVFnQUxJZ0FiS1ZJZ2s0QWdRQ2Z5QUpRd0FBZ0wrU0lncUxRd0FBQUU5ZEJFQWdDcWdNQVF0QmdJQ0FnSGdMSWdnZ0JtcEJnUkJPQkVBZ0JCQXlRUU1QQ3lBRUlBSkJBM1FRTUNJRk5nSUlJQVZGRFFGQkFDQUNheUVBSUFKQkFYUWhCME1BQUFBL0lBbVZ1MFFZTFVSVSt5RVpRS0lpRDdZaEN5QUd0eUVPUXdBQUFBQWhDaUFGSVFFRFFDQUxJUWtnQUFSQUlBMUVHQzFFVlBzaEtVQ2lJQTZqdGhDTUFTRUpJQTFFR0MxRVZQc2hHVUNpSUE2anRoQ01BU0VNSUE4Z0FMZWl0aENOQVNBQXNwVWdDVU1LMTZNOWxDQU1Rd0FBQUwrVVF6MEsxejZTa3BRaENRc2dBU0FKT0FJQUlBQkJBV29oQUNBQlFRUnFJUUVnRFVRQUFBQUFBQUR3UDZBaERTQUtJQW1TSVFvZ0IwRi9haUlIRFFBTElBSkJBWFFoQVNBRklRQURRQ0FBSUFBcUFnQWdDcFU0QWdBZ0FFRUVhaUVBSUFGQmYyb2lBUTBBQ3lBRUlBaEJnQkJxSWdGQkFoQXpJZ0EyQWhBZ0FFVUVRQ0FGRURJZ0JDZ0NFQ0lBQkVBZ0FCQXlDeUFFS0FJVUlnQkZEUUlnQUJBeURBSUxJQVFnQVNBQ1FRSjBha0VDRURNaUFEWUNGQ0FBUlFSQUlBVVFNaUFFS0FJUUlnQUVRQ0FBRURJTElBUW9BaFFpQUVVTkFpQUFFRElNQWdzZ0F5QUVOZ0lBUVFBRlFRRUxEd3NnQkJBeVFRRUxOd0VCZnlBQUJFQWdBQ2dDQ0NJQkJFQWdBUkF5Q3lBQUtBSVFJZ0VFUUNBQkVESUxJQUFvQWhRaUFRUkFJQUVRTWdzZ0FCQXlDd3UzQkFJUGZ3TjlJQUFxQWdRaUUwTUFBSUEvWGtFQmN5RUVBbjhnRTBNQUFJQy9raUlUaTBNQUFBQlBYUVJBSUJPb0RBRUxRWUNBZ0lCNEN5RUZBa0FnQkVVRVFDQUNRUUZJQkVCQkFBOExJQVZCQVdvaER5QUFLQUlNSUFBb0FnQkJBWFJxSVFRRFFDQUFLQUlVSUFSQkFYUnFJQUVnQWlBQUtBSVlJQVJySWdVZ0FpQUZTQnNpQ1VFQmRDSVFFSDhhSUFBb0FoQWhEU0FBS0FJVUlRb2dCQ0FKYWlJT0lBQW9BZ0FpQjJzZ0Iwb0VRQ0FBS0FJSUlSRWdDaUFIUVFGMElnUnFJUXNnRGlBRWF5RVNRUUFoREFOQVF3QUFBQUFoRXlBTklBeEJBWFJxQW44Z0IwRUJUZ1JBSUFzaEJDQVJJUVVnQnlFSUEwQWdFeUFGS2dJQUlBUXVBUUN5bEpJaEV5QUVRWDVxSVFRZ0JVRUVhaUVGSUFoQmYyb2lDQTBBQzBILy93RWdFME1BL3Y5R1lBMEJHa0dBZ0FJZ0UwTUFBQURIWHcwQkdnc2dFNHREQUFBQVQxMEVRQ0FUcUF3QkMwR0FnSUNBZUFzN0FRQWdDMEVDYWlFTElBeEJBV29pRENBU1J3MEFDd3NnQUNvQ0JDSVVRd0FBZ0wrU0loTWdBQ2dDRENBSmFpSUlzaUlWWFVFQmMwVUVRQ0FESUFaQkFYUnFJUVFEUUNBRUlBMENmeUFUaTBNQUFBQlBYUVJBSUJPb0RBRUxRWUNBZ0lCNEMwRUJkR292QVFBN0FRQWdCRUVDYWlFRUlBWkJBV29oQmlBVUlCT1NJaE1nRlYwTkFBc0xJQUFnQ0NBUGJ5SUVOZ0lNSUFvZ0NpQU9JQVFnQjBFQmRHb2lCR3RCQVhScUlBUkJBWFFRamdFYUlBRWdFR29oQVNBQ0lBbHJJZ0pCQUVvTkFBc01BUXNnQXlBQklBSkJBWFFRZnhvZ0FpRUdDeUFHQ3k0QkFYMENmeUFBS2dJRUlBR3lsSTBpQW90REFBQUFUMTBFUUNBQ3FBd0JDMEdBZ0lDQWVBc2dBQ2dDREdzTEtRRUJmU0FBS0FJTUlBRnFzaUFBS2dJRWxTSUNpME1BQUFCUFhRUkFJQUtvRHd0QmdJQ0FnSGdMR0FBZ0FDZ0NGRUVBSUFBb0FoZ1FmUm9nQUVFQU5nSU1DMlVCQW44akFFRVFheUlDSkFBQ1FFSFFOaTBBQUEwQUlBSWdBVFlDREVFQVFRQWdBQ0FCRUR3aEF5QUNJQUUyQWd3Z0EwRUJhaUlERURBaUFVVUVRRUdRTVJBQURBRUxJQUVnQXlBQUlBSW9BZ3dRUEJvZ0FSQUFJQUVRTWdzZ0FrRVFhaVFBQ3dvQVFkQTJRUUE2QUFBTENnQkIwRFpCQVRvQUFBc0xyU2dXQUVHQUNBdkFEVk4xWTJObGMzTUFTV3hzWldkaGJDQmllWFJsSUhObGNYVmxibU5sQUVSdmJXRnBiaUJsY25KdmNnQlNaWE4xYkhRZ2JtOTBJSEpsY0hKbGMyVnVkR0ZpYkdVQVRtOTBJR0VnZEhSNUFGQmxjbTFwYzNOcGIyNGdaR1Z1YVdWa0FFOXdaWEpoZEdsdmJpQnViM1FnY0dWeWJXbDBkR1ZrQUU1dklITjFZMmdnWm1sc1pTQnZjaUJrYVhKbFkzUnZjbmtBVG04Z2MzVmphQ0J3Y205alpYTnpBRVpwYkdVZ1pYaHBjM1J6QUZaaGJIVmxJSFJ2YnlCc1lYSm5aU0JtYjNJZ1pHRjBZU0IwZVhCbEFFNXZJSE53WVdObElHeGxablFnYjI0Z1pHVjJhV05sQUU5MWRDQnZaaUJ0WlcxdmNua0FVbVZ6YjNWeVkyVWdZblZ6ZVFCSmJuUmxjbkoxY0hSbFpDQnplWE4wWlcwZ1kyRnNiQUJTWlhOdmRYSmpaU0IwWlcxd2IzSmhjbWxzZVNCMWJtRjJZV2xzWVdKc1pRQkpiblpoYkdsa0lITmxaV3NBUTNKdmMzTXRaR1YyYVdObElHeHBibXNBVW1WaFpDMXZibXg1SUdacGJHVWdjM2x6ZEdWdEFFUnBjbVZqZEc5eWVTQnViM1FnWlcxd2RIa0FRMjl1Ym1WamRHbHZiaUJ5WlhObGRDQmllU0J3WldWeUFFOXdaWEpoZEdsdmJpQjBhVzFsWkNCdmRYUUFRMjl1Ym1WamRHbHZiaUJ5WldaMWMyVmtBRWh2YzNRZ2FYTWdkVzV5WldGamFHRmliR1VBUVdSa2NtVnpjeUJwYmlCMWMyVUFRbkp2YTJWdUlIQnBjR1VBU1M5UElHVnljbTl5QUU1dklITjFZMmdnWkdWMmFXTmxJRzl5SUdGa1pISmxjM01BVG04Z2MzVmphQ0JrWlhacFkyVUFUbTkwSUdFZ1pHbHlaV04wYjNKNUFFbHpJR0VnWkdseVpXTjBiM0o1QUZSbGVIUWdabWxzWlNCaWRYTjVBRVY0WldNZ1ptOXliV0YwSUdWeWNtOXlBRWx1ZG1Gc2FXUWdZWEpuZFcxbGJuUUFRWEpuZFcxbGJuUWdiR2x6ZENCMGIyOGdiRzl1WndCVGVXMWliMnhwWXlCc2FXNXJJR3h2YjNBQVJtbHNaVzVoYldVZ2RHOXZJR3h2Ym1jQVZHOXZJRzFoYm5rZ2IzQmxiaUJtYVd4bGN5QnBiaUJ6ZVhOMFpXMEFUbThnWm1sc1pTQmtaWE5qY21sd2RHOXljeUJoZG1GcGJHRmliR1VBUW1Ga0lHWnBiR1VnWkdWelkzSnBjSFJ2Y2dCT2J5QmphR2xzWkNCd2NtOWpaWE56QUVKaFpDQmhaR1J5WlhOekFFWnBiR1VnZEc5dklHeGhjbWRsQUZSdmJ5QnRZVzU1SUd4cGJtdHpBRTV2SUd4dlkydHpJR0YyWVdsc1lXSnNaUUJTWlhOdmRYSmpaU0JrWldGa2JHOWpheUIzYjNWc1pDQnZZMk4xY2dCVGRHRjBaU0J1YjNRZ2NtVmpiM1psY21GaWJHVUFVSEpsZG1sdmRYTWdiM2R1WlhJZ1pHbGxaQUJQY0dWeVlYUnBiMjRnWTJGdVkyVnNaV1FBUm5WdVkzUnBiMjRnYm05MElHbHRjR3hsYldWdWRHVmtBRTV2SUcxbGMzTmhaMlVnYjJZZ1pHVnphWEpsWkNCMGVYQmxBRWxrWlc1MGFXWnBaWElnY21WdGIzWmxaQUJNYVc1cklHaGhjeUJpWldWdUlITmxkbVZ5WldRQVVISnZkRzlqYjJ3Z1pYSnliM0lBUW1Ga0lHMWxjM05oWjJVQVRtOTBJR0VnYzI5amEyVjBBRVJsYzNScGJtRjBhVzl1SUdGa1pISmxjM01nY21WeGRXbHlaV1FBVFdWemMyRm5aU0IwYjI4Z2JHRnlaMlVBVUhKdmRHOWpiMndnZDNKdmJtY2dkSGx3WlNCbWIzSWdjMjlqYTJWMEFGQnliM1J2WTI5c0lHNXZkQ0JoZG1GcGJHRmliR1VBVUhKdmRHOWpiMndnYm05MElITjFjSEJ2Y25SbFpBQk9iM1FnYzNWd2NHOXlkR1ZrQUVGa1pISmxjM01nWm1GdGFXeDVJRzV2ZENCemRYQndiM0owWldRZ1lua2djSEp2ZEc5amIyd0FRV1JrY21WemN5QnViM1FnWVhaaGFXeGhZbXhsQUU1bGRIZHZjbXNnYVhNZ1pHOTNiZ0JPWlhSM2IzSnJJSFZ1Y21WaFkyaGhZbXhsQUVOdmJtNWxZM1JwYjI0Z2NtVnpaWFFnWW5rZ2JtVjBkMjl5YXdCRGIyNXVaV04wYVc5dUlHRmliM0owWldRQVRtOGdZblZtWm1WeUlITndZV05sSUdGMllXbHNZV0pzWlFCVGIyTnJaWFFnYVhNZ1kyOXVibVZqZEdWa0FGTnZZMnRsZENCdWIzUWdZMjl1Ym1WamRHVmtBRTl3WlhKaGRHbHZiaUJoYkhKbFlXUjVJR2x1SUhCeWIyZHlaWE56QUU5d1pYSmhkR2x2YmlCcGJpQndjbTluY21WemN3QlRkR0ZzWlNCbWFXeGxJR2hoYm1Sc1pRQlJkVzkwWVNCbGVHTmxaV1JsWkFCTmRXeDBhV2h2Y0NCaGRIUmxiWEIwWldRQVEyRndZV0pwYkdsMGFXVnpJR2x1YzNWbVptbGphV1Z1ZEFBQUFIVUNUZ0RXQWVJRXVRUVlBWTRGN1FJV0JQSUFsd01CQXpnRnJ3R0NBVThETHdRZUFOUUZvZ0FTQXg0RHdnSGVBd2dBckFVQUFXUUM4UUZsQlRRQ2pBTFBBaTBEVEFUakJaOEMrQVFjQlFnRnNRSkxCUlVDZUFCU0Fqd0Q4UVBrQU1NRGZRVE1BS29EZVFVa0FtNEJiUU1pQktzRVJBRDdBYTRBZ3dOZ0FPVUJCd1NVQkY0RUt3QllBVGtCa2dEQ0Jac0JRd0pHQWZZRkFBQ3dHQUFBTFNzZ0lDQXdXREI0QUNodWRXeHNLUUJCMEJVTFFSa0FDZ0FaR1JrQUFBQUFCUUFBQUFBQUFBa0FBQUFBQ3dBQUFBQUFBQUFBR1FBUkNoa1pHUU1LQndBQkd3a0xHQUFBQ1FZTEFBQUxBQVlaQUFBQUdSa1pBRUdoRmdzaERnQUFBQUFBQUFBQUdRQUtEUmtaR1FBTkFBQUNBQWtPQUFBQUNRQU9BQUFPQUVIYkZnc0JEQUJCNXhZTEZSTUFBQUFBRXdBQUFBQUpEQUFBQUFBQURBQUFEQUJCbFJjTEFSQUFRYUVYQ3hVUEFBQUFCQThBQUFBQUNSQUFBQUFBQUJBQUFCQUFRYzhYQ3dFU0FFSGJGd3NlRVFBQUFBQVJBQUFBQUFrU0FBQUFBQUFTQUFBU0FBQWFBQUFBR2hvYUFFR1NHQXNPR2dBQUFCb2FHZ0FBQUFBQUFBa0FRY01ZQ3dFVUFFSFBHQXNWRndBQUFBQVhBQUFBQUFrVUFBQUFBQUFVQUFBVUFFSDlHQXNCRmdCQmlSa0xtUUVWQUFBQUFCVUFBQUFBQ1JZQUFBQUFBQllBQUJZQUFGTjFjSEJ2Y25RZ1ptOXlJR1p2Y20xaGRIUnBibWNnYkc5dVp5QmtiM1ZpYkdVZ2RtRnNkV1Z6SUdseklHTjFjbkpsYm5Sc2VTQmthWE5oWW14bFpDNEtWRzhnWlc1aFlteGxJR2wwTENCaFpHUWdMV3hqTFhCeWFXNTBjMk5oYmkxc2IyNW5MV1J2ZFdKc1pTQjBieUIwYUdVZ2JHbHVheUJqYjIxdFlXNWtMZ29BUWJBYUN6UXdNVEl6TkRVMk56ZzVRVUpEUkVWR0xUQllLekJZSURCWUxUQjRLekI0SURCNEFHbHVaZ0JKVGtZQWJtRnVBRTVCVGdBdUFFSHdHZ3ZYRlFNQUFBQUVBQUFBQkFBQUFBWUFBQUNEK2FJQVJFNXVBUHdwRlFEUlZ5Y0EzVFQxQUdMYndBQThtWlVBUVpCREFHTlIvZ0M3M3FzQXQySEZBRHB1SkFEU1RVSUFTUWJnQUFucUxnQWNrdEVBNngzK0FDbXhIQURvUHFjQTlUV0NBRVM3TGdDYzZZUUF0Q1p3QUVGK1h3RFdrVGtBVTRNNUFKejBPUUNMWDRRQUtQbTlBUGdmT3dEZS81Y0FENWdGQUJFdjd3QUtXb3NBYlI5dEFNOStOZ0FKeXljQVJrKzNBSjVtUHdBdDZsOEF1aWQxQU9Ycnh3QTllL0VBOXprSEFKSlNpZ0Q3YStvQUg3RmZBQWhkalFBd0ExWUFlL3hHQVBDcmF3QWd2TThBTnZTYUFPT3BIUUJlWVpFQUNCdm1BSVdaWlFDZ0ZGOEFqVUJvQUlEWS93QW5jMDBBQmdZeEFNcFdGUURKcUhNQWUrSmdBR3VNd0FBWnhFY0F6V2ZEQUFubzNBQlpneW9BaTNiRUFLWWNsZ0JFcjkwQUdWZlJBS1UrQlFBRkIvOEFNMzQvQU1JeTZBQ1lUOTRBdTMweUFDWTl3d0FlYSs4QW4vaGVBRFVmT2dCLzhzb0E4WWNkQUh5UUlRQnFKSHdBMVc3NkFEQXRkd0FWTzBNQXRSVEdBTU1ablFDdHhNSUFMRTFCQUF3QVhRQ0dmVVlBNDNFdEFKdkdtZ0F6WWdBQXROSjhBTFNubHdBM1ZkVUExejcyQUtNUUdBQk5kdndBWkowcUFIRFhxd0JqZlBnQWVyQlhBQmNWNXdEQVNWWUFPOWJaQUtlRU9BQWtJOHNBMW9wM0FGcFVJd0FBSDdrQThRb2JBQm5PM3dDZk1mOEFaaDVxQUpsWFlRQ3MrMGNBZm4vWUFDSmx0d0F5NklrQTVyOWdBTy9FelFCc05na0FYVC9VQUJiZTF3QllPOTRBM3B1U0FOSWlLQUFvaHVnQTRsaE5BTWJLTWdBSTR4WUE0SDNMQUJmQVVBRHpIYWNBR09CYkFDNFROQUNERW1JQWcwZ0JBUFdPV3dDdHNIOEFIdW55QUVoS1F3QVFaOU1BcXQzWUFLNWZRZ0JxWWM0QUNpaWtBTk9adEFBR3B2SUFYSGQvQUtQQ2d3QmhQSWdBaW5ONEFLK01XZ0J2MTcwQUxhWmpBUFMveXdDTmdlOEFKc0ZuQUZYS1JRREsyVFlBS0tqU0FNSmhqUUFTeVhjQUJDWVVBQkpHbXdERVdjUUF5TVZFQUUyeWtRQUFGL01BMUVPdEFDbEo1UUQ5MVJBQUFMNzhBQjZVekFCd3p1NEFFejcxQU96eGdBQ3o1OE1BeC9nb0FKTUZsQURCY1Q0QUxnbXpBQXRGOHdDSUVwd0FxeUI3QUM2MW53Qkhrc0lBZXpJdkFBeFZiUUJ5cDVBQWErY2ZBREhMbGdCNUZrb0FRWG5pQVBUZmlRRG9sSmNBNHVhRUFKa3hsd0NJN1dzQVgxODJBTHY5RGdCSW1yUUFaNlJzQUhGeVFnQ05YVElBbnhXNEFMemxDUUNOTVNVQTkzUTVBREFGSEFBTkRBRUFTd2hvQUN6dVdBQkhxcEFBZE9jQ0FMM1dKQUQzZmFZQWJraHlBSjhXN3dDT2xLWUF0SkgyQU5GVFVRRFBDdklBSUpnekFQVkxmZ0N5WTJnQTNUNWZBRUJkQXdDRmlYOEFWVklwQURka3dBQnQyQkFBTWtneUFGdE1kUUJPY2RRQVJWUnVBQXNKd1FBcTlXa0FGR2JWQUNjSG5RQmRCRkFBdER2YkFPcDJ4UUNIK1JjQVNXdDlBQjBudWdDV2FTa0F4c3lzQUswVVZBQ1E0bW9BaU5tSkFDeHlVQUFFcEw0QWR3ZVVBUE13Y0FBQS9DY0E2bkdvQUdiQ1NRQms0RDBBbDkyREFLTS9sd0JEbFAwQURZYU1BREZCM2dDU09aMEEzWENNQUJlMzV3QUkzenNBRlRjckFGeUFvQUJhZ0pNQUVCR1NBQS9vMkFCc2dLOEEyLzlMQURpUUR3QlpHSFlBWXFVVkFHSEx1d0RIaWJrQUVFQzlBTkx5QkFCSmRTY0E2N2IyQU5zaXV3QUtGS29BaVNZdkFHU0RkZ0FKT3pNQURwUWFBRkU2cWdBZG84SUFyKzJ1QUZ3bUVnQnR3azBBTFhxY0FNQldsd0FEUDRNQUNmRDJBQ3RBakFCdE1aa0FPYlFIQUF3Z0ZRRFl3MXNBOVpMRUFNYXRTd0JPeXFVQXB6Zk5BT2FwTmdDcmtwUUEzVUpvQUJsajNnQjJqTzhBYUl0U0FQemJOd0N1b2FzQTN4VXhBQUN1b1FBTSs5b0FaRTFtQU8wRnR3QXBaVEFBVjFhL0FFZi9PZ0JxK2JrQWRiN3pBQ2lUM3dDcmdEQUFab3oyQUFUTEZRRDZJZ1lBMmVRZEFEMnpwQUJYRzQ4QU5zMEpBRTVDNlFBVHZxUUFNeU8xQVBDcUdnQlBaYWdBMHNHbEFBcy9Ed0JiZU0wQUkvbDJBSHVMQkFDSkYzSUF4cVpUQUc5dTRnRHY2d0FBbTBwWUFNVGF0d0NxWnJvQWRzL1BBTkVDSFFDeDhTMEFqSm5CQU1PdGR3Q0dTTm9BOTEyZ0FNYUE5QUNzOEM4QTNleWFBRDljdkFEUTNtMEFrTWNmQUNyYnRnQ2pKVG9BQUsrYUFLMVRrd0MyVndRQUtTMjBBRXVBZmdEYUI2Y0FkcW9PQUh0Wm9RQVdFaW9BM0xjdEFQcmwvUUNKMi80QWliNzlBT1IyYkFBR3Fmd0FQb0J3QUlWdUZRRDloLzhBS0Q0SEFHRm5Nd0FxR0lZQVRiM3FBTFBucndDUGJXNEFsV2M1QURHL1d3Q0UxMGdBTU44V0FNY3RRd0FsWVRVQXlYRE9BRERMdUFDL2JQMEFwQUNpQUFWczVBQmEzYUFBSVc5SEFHSVMwZ0M1WElRQWNHRkpBR3RXNEFDWlVnRUFVRlUzQUI3VnR3QXo4Y1FBRTI1ZkFGMHc1QUNGTHFrQUhiTERBS0V5TmdBSXQ2UUE2ckhVQUJiM0lRQ1BhZVFBSi85M0FBd0RnQUNOUUMwQVQ4MmdBQ0NsbVFDem90TUFMMTBLQUxUNVFnQVIyc3NBZmI3UUFKdmJ3UUNyRjcwQXlxS0JBQWhxWEFBdVZSY0FKd0JWQUg4VThBRGhCNFlBRkF0a0FKWkJqUUNIdnQ0QTJ2MHFBR3NsdGdCN2lUUUFCZlArQUxtL25nQm9hazhBU2lxb0FFL0VXZ0F0K0x3QTExcVlBUFRIbFFBTlRZMEFJRHFtQUtSWFh3QVVQN0VBZ0RpVkFNd2dBUUJ4M1lZQXlkNjJBTDlnOVFCTlpSRUFBUWRyQUl5d3JBQ3l3TkFBVVZWSUFCNzdEZ0NWY3NNQW93WTdBTUJBTlFBRzNIc0E0RVhNQUU0cCtnRFd5c2dBNlBOQkFIeGszZ0NiWk5nQTJiNHhBS1NYd3dCM1dOUUFhZVBGQVBEYUV3QzZPandBUmhoR0FGVjFYd0RTdmZVQWJwTEdBS3d1WFFBT1JPMEFIRDVDQUdIRWh3QXAvZWtBNTliekFDSjh5Z0J2a1RVQUNPREZBUC9YalFCdWF1SUFzUDNHQUpNSXdRQjhYWFFBYTYyeUFNMXVuUUErY25zQXhoRnFBUGZQcVFBcGM5OEF0Y202QUxjQVVRRGlzZzBBZExva0FPVjlZQUIwMklvQURSVXNBSUVZREFCK1pwUUFBU2tXQUo5NmRnRDkvYjRBVmtYdkFObCtOZ0RzMlJNQWk3cTVBTVNYL0FBeHFDY0E4VzdEQUpURk5nRFlxRllBdEtpMUFNL01EZ0FTaVMwQWIxYzBBQ3hXaVFDWnp1TUExaUM1QUd0ZXFnQStLcHdBRVYvTUFQMExTZ0RoOVBzQWpqdHRBT0tHTEFEcDFJUUEvTFNwQU8vdTBRQXVOY2tBTHpsaEFEZ2hSQUFiMmNnQWdmd0tBUHRLYWdBdkhOZ0FVN1NFQUU2WmpBQlVJc3dBS2xYY0FNREcxZ0FMR1pZQUduQzRBR21WWkFBbVdtQUFQMUx1QUg4UkR3RDB0UkVBL012MUFEUzhMUUEwdk80QTZGM01BTjFlWUFCbmpwc0FralB2QU1rWHVBQmhXSnNBNFZlOEFGR0R4Z0RZUGhBQTNYRklBQzBjM1FDdkdLRUFJU3hHQUZuejF3RFplcGdBbmxUQUFFK0crZ0JXQnZ3QTVYbXVBSWtpTmdBNHJTSUFaNVBjQUZYb3FnQ0NKamdBeXVlYkFGRU5wQUNaTTdFQXFkY09BR2tGU0FCbHN2QUFmNGluQUloTWx3RDUwVFlBSVpLekFIdUNTZ0NZenlFQVFKL2NBTnhIVlFEaGREb0FaK3RDQVA2ZDN3QmUxRjhBZTJla0FMcXNlZ0JWOXFJQUs0Z2pBRUc2VlFCWmJnZ0FJU3FHQURsSGd3Q0o0K1lBNVo3VUFFbjdRQUQvVnVrQUhBL0tBTVZaaWdDVStpc0EwOEhGQUEvRnp3RGJXcTRBUjhXR0FJVkRZZ0FoaGpzQUxIbVVBQkJoaHdBcVRIc0FnQ3dhQUVPL0VnQ0lKcEFBZUR5SkFLakU1QURsMjNzQXhEckNBQ2IwNmdEM1o0b0FEWksvQUdXakt3QTlrN0VBdlh3TEFLUlIzQUFuM1dNQWFlSGRBSnFVR1FDb0taVUFhTTRvQUFudHRBQkVueUFBVHBqS0FIQ0NZd0IrZkNNQUQ3a3lBS2YxamdBVVZ1Y0FJZkVJQUxXZEtnQnZmazBBcFJsUkFMWDVxd0NDMzlZQWx0MWhBQlkyQWdERU9wOEFnNktoQUhMdGJRQTVqWG9BZ3JpcEFHc3lYQUJHSjFzQUFEVHRBTklBZHdEODlGVUFBVmxOQU9CeGdBQkIwekFMVlVEN0lmay9BQUFBQUMxRWRENEFBQUNBbUViNFBBQUFBR0JSekhnN0FBQUFnSU1iOERrQUFBQkFJQ1Y2T0FBQUFJQWlndU0yQUFBQUFCM3phVFZ0WlcxdmNua2dZV3hzYjJOaGRHbHZiaUJtWVdsc1pXUUFRYkF4Q3dFRkFFRzhNUXNCQWdCQjBERUxDZ01BQUFBRUFBQUFVQnNBUWVneEN3d0NBQUFBQUFBQUFQLy8vLzhBUWFBeUN3S3dHQUF2Q1hCeWIyUjFZMlZ5Y3dFTWNISnZZMlZ6YzJWa0xXSjVBUVZqYkdGdVp3OHhNQzR3TGpBdE5IVmlkVzUwZFRFPSc7CgogIGZ1bmN0aW9uIGFycmF5QnVmZmVyVG9TdHJpbmdBdEluZGV4KGFycmF5QnVmZmVyLCBpbmRleCkgewogICAgdmFyIHN0cmluZ0J1ZmZlciA9ICcnOwogICAgdmFyIGluZGV4QnVmZmVyID0gaW5kZXg7CgogICAgd2hpbGUgKGFycmF5QnVmZmVyW2luZGV4QnVmZmVyXSA9PT0gMCkgewogICAgICBzdHJpbmdCdWZmZXIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShhcnJheUJ1ZmZlcltpbmRleEJ1ZmZlcisrXSk7CiAgICB9CgogICAgcmV0dXJuIHN0cmluZ0J1ZmZlcjsKICB9CiAgZnVuY3Rpb24gYmFzZTY0VG9VaW50OEFycmF5KGJhc2U2NFN0cmluZykgewogICAgdmFyIGJhc2U2NFN0cmluZ0RlY29kZWQgPSBhdG9iKGJhc2U2NFN0cmluZyk7CiAgICB2YXIgYmluYXJ5QXJyYXkgPSBuZXcgVWludDhBcnJheShiYXNlNjRTdHJpbmdEZWNvZGVkLmxlbmd0aCk7CgogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlNjRTdHJpbmdEZWNvZGVkLmxlbmd0aDsgaSsrKSB7CiAgICAgIGJpbmFyeUFycmF5W2ldID0gYmFzZTY0U3RyaW5nRGVjb2RlZC5jaGFyQ29kZUF0KGkpOwogICAgfQoKICAgIHJldHVybiBiaW5hcnlBcnJheTsKICB9CgogIHZhciB3YXNpU25hcHNob3RQcmV2aWV3MUVtdWxhdG9yID0gewogICAgYXJnc19nZXQ6IGZ1bmN0aW9uIGFyZ3NfZ2V0KGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGFyZ3Nfc2l6ZXNfZ2V0OiBmdW5jdGlvbiBhcmdzX3NpemVzX2dldChpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBlbnZpcm9uX2dldDogZnVuY3Rpb24gZW52aXJvbl9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZW52aXJvbl9zaXplc19nZXQ6IGZ1bmN0aW9uIGVudmlyb25fc2l6ZXNfZ2V0KGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGNsb2NrX3Jlc19nZXQ6IGZ1bmN0aW9uIGNsb2NrX3Jlc19nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgY2xvY2tfdGltZV9nZXQ6IGZ1bmN0aW9uIGNsb2NrX3RpbWVfZ2V0KGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX2FkdmlzZTogZnVuY3Rpb24gZmRfYWR2aXNlKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX2FsbG9jYXRlOiBmdW5jdGlvbiBmZF9hbGxvY2F0ZShpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF9jbG9zZTogZnVuY3Rpb24gZmRfY2xvc2UoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfZGF0YXN5bmM6IGZ1bmN0aW9uIGZkX2RhdGFzeW5jKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX2Zkc3RhdF9nZXQ6IGZ1bmN0aW9uIGZkX2Zkc3RhdF9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfZmRzdGF0X3NldF9mbGFnczogZnVuY3Rpb24gZmRfZmRzdGF0X3NldF9mbGFncyhpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF9mZHN0YXRfc2V0X3JpZ2h0czogZnVuY3Rpb24gZmRfZmRzdGF0X3NldF9yaWdodHMoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfZmlsZXN0YXRfZ2V0OiBmdW5jdGlvbiBmZF9maWxlc3RhdF9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfZmlsZXN0YXRfc2V0X3NpemU6IGZ1bmN0aW9uIGZkX2ZpbGVzdGF0X3NldF9zaXplKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX2ZpbGVzdGF0X3NldF90aW1lczogZnVuY3Rpb24gZmRfZmlsZXN0YXRfc2V0X3RpbWVzKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX3ByZWFkOiBmdW5jdGlvbiBmZF9wcmVhZChpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF9wcmVzdGF0X2dldDogZnVuY3Rpb24gZmRfcHJlc3RhdF9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfcHJlc3RhdF9kaXJfbmFtZTogZnVuY3Rpb24gZmRfcHJlc3RhdF9kaXJfbmFtZShpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF9wd3JpdGU6IGZ1bmN0aW9uIGZkX3B3cml0ZShpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF9yZWFkOiBmdW5jdGlvbiBmZF9yZWFkKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX3JlYWRkaXI6IGZ1bmN0aW9uIGZkX3JlYWRkaXIoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfcmVudW1iZXI6IGZ1bmN0aW9uIGZkX3JlbnVtYmVyKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX3NlZWs6IGZ1bmN0aW9uIGZkX3NlZWsoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgZmRfc3luYzogZnVuY3Rpb24gZmRfc3luYyhpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBmZF90ZWxsOiBmdW5jdGlvbiBmZF90ZWxsKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIGZkX3dyaXRlOiBmdW5jdGlvbiBmZF93cml0ZShpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBwYXRoX2NyZWF0ZV9kaXJlY3Rvcnk6IGZ1bmN0aW9uIHBhdGhfY3JlYXRlX2RpcmVjdG9yeShpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0sCiAgICBwYXRoX2ZpbGVzdGF0X2dldDogZnVuY3Rpb24gcGF0aF9maWxlc3RhdF9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgcGF0aF9maWxlc3RhdF9zZXRfdGltZXM6IGZ1bmN0aW9uIHBhdGhfZmlsZXN0YXRfc2V0X3RpbWVzKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHBhdGhfbGluazogZnVuY3Rpb24gcGF0aF9saW5rKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHBhdGhfb3BlbjogZnVuY3Rpb24gcGF0aF9vcGVuKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHBhdGhfcmVhZGxpbms6IGZ1bmN0aW9uIHBhdGhfcmVhZGxpbmsoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgcGF0aF9yZW1vdmVfZGlyZWN0b3J5OiBmdW5jdGlvbiBwYXRoX3JlbW92ZV9kaXJlY3RvcnkoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgcGF0aF9yZW5hbWU6IGZ1bmN0aW9uIHBhdGhfcmVuYW1lKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHBhdGhfc3ltbGluazogZnVuY3Rpb24gcGF0aF9zeW1saW5rKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHBhdGhfdW5saW5rX2ZpbGU6IGZ1bmN0aW9uIHBhdGhfdW5saW5rX2ZpbGUoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgcG9sbF9vbmVvZmY6IGZ1bmN0aW9uIHBvbGxfb25lb2ZmKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHByb2NfZXhpdDogZnVuY3Rpb24gcHJvY19leGl0KGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHByb2NfcmFpc2U6IGZ1bmN0aW9uIHByb2NfcmFpc2UoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgc2NoZWRfeWllbGQ6IGZ1bmN0aW9uIHNjaGVkX3lpZWxkKGlucHV0KSB7CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIHJhbmRvbV9nZXQ6IGZ1bmN0aW9uIHJhbmRvbV9nZXQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgc29ja19yZWN2OiBmdW5jdGlvbiBzb2NrX3JlY3YoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgc29ja19zZW5kOiBmdW5jdGlvbiBzb2NrX3NlbmQoaW5wdXQpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgc29ja19zaHV0ZG93bjogZnVuY3Rpb24gc29ja19zaHV0ZG93bihpbnB1dCkgewogICAgICByZXR1cm4gMDsKICAgIH0KICB9OwoKICB2YXIgRG93bnNhbXBsZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkgewogICAgZnVuY3Rpb24gRG93bnNhbXBsZXIoaGFuZGxlV2FzbSkgewogICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRG93bnNhbXBsZXIpOwoKICAgICAgdGhpcy5fcHZEb3duc2FtcGxlckNvbnZlcnROdW1TYW1wbGVzVG9JbnB1dFNhbXBsZVJhdGUgPSBoYW5kbGVXYXNtLnB2RG93bnNhbXBsZXJDb252ZXJ0TnVtU2FtcGxlc1RvSW5wdXRTYW1wbGVSYXRlOwogICAgICB0aGlzLl9wdkRvd25zYW1wbGVyUmVzZXQgPSBoYW5kbGVXYXNtLnB2RG93bnNhbXBsZXJSZXNldDsKICAgICAgdGhpcy5fcHZEb3duc2FtcGxlclByb2Nlc3MgPSBoYW5kbGVXYXNtLnB2RG93bnNhbXBsZXJQcm9jZXNzOwogICAgICB0aGlzLl9wdkRvd25zYW1wbGVyRGVsZXRlID0gaGFuZGxlV2FzbS5wdkRvd25zYW1wbGVyRGVsZXRlOwogICAgICB0aGlzLl93YXNtTWVtb3J5ID0gaGFuZGxlV2FzbS5tZW1vcnk7CiAgICAgIHRoaXMuX2lucHV0QnVmZmVyQWRkcmVzcyA9IGhhbmRsZVdhc20uaW5wdXRCdWZmZXJBZGRyZXNzOwogICAgICB0aGlzLl9vYmplY3RBZGRyZXNzID0gaGFuZGxlV2FzbS5vYmplY3RBZGRyZXNzOwogICAgICB0aGlzLl9vdXRwdXRCdWZmZXJBZGRyZXNzID0gaGFuZGxlV2FzbS5vdXRwdXRCdWZmZXJBZGRyZXNzOwogICAgICB0aGlzLl9tZW1vcnlCdWZmZXIgPSBuZXcgSW50MTZBcnJheShoYW5kbGVXYXNtLm1lbW9yeS5idWZmZXIpOwogICAgICB0aGlzLl9tZW1vcnlCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KGhhbmRsZVdhc20ubWVtb3J5LmJ1ZmZlcik7CiAgICB9CgogICAgX2NyZWF0ZUNsYXNzKERvd25zYW1wbGVyLCBbewogICAgICBrZXk6ICJwcm9jZXNzIiwKICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3MoaW5wdXRCdWZmZXIsIGlucHV0QnVmZmVyU2l6ZSwgb3V0cHV0QnVmZmVyKSB7CiAgICAgICAgdGhpcy5fbWVtb3J5QnVmZmVyLnNldChpbnB1dEJ1ZmZlciwgdGhpcy5faW5wdXRCdWZmZXJBZGRyZXNzIC8gSW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7CgogICAgICAgIHZhciBwcm9jZXNzZWRTYW1wbGVzID0gdGhpcy5fcHZEb3duc2FtcGxlclByb2Nlc3ModGhpcy5fb2JqZWN0QWRkcmVzcywgdGhpcy5faW5wdXRCdWZmZXJBZGRyZXNzLCBpbnB1dEJ1ZmZlclNpemUsIHRoaXMuX291dHB1dEJ1ZmZlckFkZHJlc3MpOwoKICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2Nlc3NlZFNhbXBsZXM7IGkrKykgewogICAgICAgICAgb3V0cHV0QnVmZmVyW2ldID0gdGhpcy5fbWVtb3J5QnVmZmVyVmlldy5nZXRJbnQxNih0aGlzLl9vdXRwdXRCdWZmZXJBZGRyZXNzICsgaSAqIEludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIHRydWUpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZFNhbXBsZXM7CiAgICAgIH0KICAgIH0sIHsKICAgICAga2V5OiAicmVzZXQiLAogICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoKSB7CiAgICAgICAgdGhpcy5fcHZEb3duc2FtcGxlclJlc2V0KHRoaXMuX29iamVjdEFkZHJlc3MpOwogICAgICB9CiAgICB9LCB7CiAgICAgIGtleTogImRlbGV0ZSIsCiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVsZXRlKCkgewogICAgICAgIHRoaXMuX3B2RG93bnNhbXBsZXJEZWxldGUodGhpcy5fb2JqZWN0QWRkcmVzcyk7CiAgICAgIH0KICAgIH0sIHsKICAgICAga2V5OiAiZ2V0TnVtUmVxdWlyZWRJbnB1dFNhbXBsZXMiLAogICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TnVtUmVxdWlyZWRJbnB1dFNhbXBsZXMobnVtU2FtcGxlKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuX3B2RG93bnNhbXBsZXJDb252ZXJ0TnVtU2FtcGxlc1RvSW5wdXRTYW1wbGVSYXRlKHRoaXMuX29iamVjdEFkZHJlc3MsIG51bVNhbXBsZSk7CiAgICAgIH0KICAgIH1dLCBbewogICAgICBrZXk6ICJjcmVhdGUiLAogICAgICB2YWx1ZTogZnVuY3Rpb24gKCkgewogICAgICAgIHZhciBfY3JlYXRlID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvci5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUoaW5wdXRGcmVxdWVuY3ksIG91dHB1dEZyZXF1ZW5jeSwgb3JkZXIsIGZyYW1lTGVuZ3RoKSB7CiAgICAgICAgICB2YXIgd2FzbU91dHB1dDsKICAgICAgICAgIHJldHVybiByZWdlbmVyYXRvci53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7CiAgICAgICAgICAgIHdoaWxlICgxKSB7CiAgICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkgewogICAgICAgICAgICAgICAgY2FzZSAwOgogICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMjsKICAgICAgICAgICAgICAgICAgcmV0dXJuIERvd25zYW1wbGVyLmluaXRXYXNtKGlucHV0RnJlcXVlbmN5LCBvdXRwdXRGcmVxdWVuY3ksIG9yZGVyLCBmcmFtZUxlbmd0aCk7CgogICAgICAgICAgICAgICAgY2FzZSAyOgogICAgICAgICAgICAgICAgICB3YXNtT3V0cHV0ID0gX2NvbnRleHQuc2VudDsKICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LmFicnVwdCgicmV0dXJuIiwgbmV3IERvd25zYW1wbGVyKHdhc21PdXRwdXQpKTsKCiAgICAgICAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgICAgICBjYXNlICJlbmQiOgogICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuc3RvcCgpOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfSwgX2NhbGxlZSk7CiAgICAgICAgfSkpOwoKICAgICAgICBmdW5jdGlvbiBjcmVhdGUoX3gsIF94MiwgX3gzLCBfeDQpIHsKICAgICAgICAgIHJldHVybiBfY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gY3JlYXRlOwogICAgICB9KCkKICAgIH0sIHsKICAgICAga2V5OiAiaW5pdFdhc20iLAogICAgICB2YWx1ZTogZnVuY3Rpb24gKCkgewogICAgICAgIHZhciBfaW5pdFdhc20gPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTIoaW5wdXRGcmVxdWVuY3ksIG91dHB1dEZyZXF1ZW5jeSwgb3JkZXIsIGZyYW1lTGVuZ3RoKSB7CiAgICAgICAgICB2YXIgbWVtb3J5LCBwdkNvbnNvbGVMb2dXYXNtLCBwdkFzc2VydFdhc20sIGltcG9ydE9iamVjdCwgd2FzbUNvZGVBcnJheSwgX3lpZWxkJFdlYkFzc2VtYmx5JGluLCBpbnN0YW5jZSwgYWxpZ25lZEFsbG9jLCBwdkRvd25zYW1wbGVySW5pdCwgcHZEb3duc2FtcGxlckNvbnZlcnROdW1TYW1wbGVzVG9JbnB1dFNhbXBsZVJhdGUsIG9iamVjdEFkZHJlc3NBZGRyZXNzLCBzdGF0dXMsIG1lbW9yeUJ1ZmZlclZpZXcsIG9iamVjdEFkZHJlc3MsIGlucHV0ZnJhbWVMZW5ndGgsIGlucHV0QnVmZmVyQWRkcmVzcywgb3V0cHV0QnVmZmVyQWRkcmVzcywgcHZEb3duc2FtcGxlclJlc2V0LCBwdkRvd25zYW1wbGVyUHJvY2VzcywgcHZEb3duc2FtcGxlckRlbGV0ZTsKCiAgICAgICAgICByZXR1cm4gcmVnZW5lcmF0b3Iud3JhcChmdW5jdGlvbiBfY2FsbGVlMiQoX2NvbnRleHQyKSB7CiAgICAgICAgICAgIHdoaWxlICgxKSB7CiAgICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7CiAgICAgICAgICAgICAgICBjYXNlIDA6CiAgICAgICAgICAgICAgICAgIG1lbW9yeSA9IG5ldyBXZWJBc3NlbWJseS5NZW1vcnkoewogICAgICAgICAgICAgICAgICAgIGluaXRpYWw6IDEwMCwKICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMDAKICAgICAgICAgICAgICAgICAgfSk7CgogICAgICAgICAgICAgICAgICBwdkNvbnNvbGVMb2dXYXNtID0gZnVuY3Rpb24gcHZDb25zb2xlTG9nV2FzbShpbmRleCkgewogICAgICAgICAgICAgICAgICAgIHZhciBtZW1vcnlCdWZmZXJVaW50OCA9IG5ldyBVaW50OEFycmF5KG1lbW9yeS5idWZmZXIpOwogICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5QnVmZmVyVG9TdHJpbmdBdEluZGV4KG1lbW9yeUJ1ZmZlclVpbnQ4LCBpbmRleCkpOwogICAgICAgICAgICAgICAgICB9OwoKICAgICAgICAgICAgICAgICAgcHZBc3NlcnRXYXNtID0gZnVuY3Rpb24gcHZBc3NlcnRXYXNtKGV4cHIsIGxpbmUsIGZpbGVOYW1lQWRkcmVzcykgewogICAgICAgICAgICAgICAgICAgIGlmIChleHByID09PSAwKSB7CiAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVtb3J5QnVmZmVyVWludDggPSBuZXcgVWludDhBcnJheShtZW1vcnkuYnVmZmVyKTsKICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGFycmF5QnVmZmVyVG9TdHJpbmdBdEluZGV4KG1lbW9yeUJ1ZmZlclVpbnQ4LCBmaWxlTmFtZUFkZHJlc3MpOwogICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJhc3NlcnRpb24gZmFpbGVkIGF0IGxpbmUgIi5jb25jYXQobGluZSwgIiBpbiBcIiIpLmNvbmNhdChmaWxlTmFtZSwgIlwiIikpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgfTsKCiAgICAgICAgICAgICAgICAgIGltcG9ydE9iamVjdCA9IHsKICAgICAgICAgICAgICAgICAgICB3YXNpX3NuYXBzaG90X3ByZXZpZXcxOiB3YXNpU25hcHNob3RQcmV2aWV3MUVtdWxhdG9yLAogICAgICAgICAgICAgICAgICAgIGVudjogewogICAgICAgICAgICAgICAgICAgICAgbWVtb3J5OiBtZW1vcnksCiAgICAgICAgICAgICAgICAgICAgICBwdl9jb25zb2xlX2xvZ193YXNtOiBwdkNvbnNvbGVMb2dXYXNtLAogICAgICAgICAgICAgICAgICAgICAgcHZfYXNzZXJ0X3dhc206IHB2QXNzZXJ0V2FzbQogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICAgICAgd2FzbUNvZGVBcnJheSA9IGJhc2U2NFRvVWludDhBcnJheShXQVNNX0JBU0U2NCk7CiAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNzsKICAgICAgICAgICAgICAgICAgcmV0dXJuIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKHdhc21Db2RlQXJyYXksIGltcG9ydE9iamVjdCk7CgogICAgICAgICAgICAgICAgY2FzZSA3OgogICAgICAgICAgICAgICAgICBfeWllbGQkV2ViQXNzZW1ibHkkaW4gPSBfY29udGV4dDIuc2VudDsKICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBfeWllbGQkV2ViQXNzZW1ibHkkaW4uaW5zdGFuY2U7CiAgICAgICAgICAgICAgICAgIGFsaWduZWRBbGxvYyA9IGluc3RhbmNlLmV4cG9ydHMuYWxpZ25lZF9hbGxvYzsKICAgICAgICAgICAgICAgICAgcHZEb3duc2FtcGxlckluaXQgPSBpbnN0YW5jZS5leHBvcnRzLnB2X2Rvd25zYW1wbGVyX2luaXQ7CiAgICAgICAgICAgICAgICAgIHB2RG93bnNhbXBsZXJDb252ZXJ0TnVtU2FtcGxlc1RvSW5wdXRTYW1wbGVSYXRlID0gaW5zdGFuY2UuZXhwb3J0cy5wdl9kb3duc2FtcGxlcl9jb252ZXJ0X251bV9zYW1wbGVzX3RvX2lucHV0X3NhbXBsZV9yYXRlOwogICAgICAgICAgICAgICAgICBvYmplY3RBZGRyZXNzQWRkcmVzcyA9IGFsaWduZWRBbGxvYyhJbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCBJbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTsKCiAgICAgICAgICAgICAgICAgIGlmICghKG9iamVjdEFkZHJlc3NBZGRyZXNzID09PSAwKSkgewogICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTU7CiAgICAgICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsbG9jIGZhaWxlZDogQ2Fubm90IGFsbG9jYXRlIG1lbW9yeScpOwoKICAgICAgICAgICAgICAgIGNhc2UgMTU6CiAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IHB2RG93bnNhbXBsZXJJbml0KGlucHV0RnJlcXVlbmN5LCBvdXRwdXRGcmVxdWVuY3ksIG9yZGVyLCBvYmplY3RBZGRyZXNzQWRkcmVzcyk7CgogICAgICAgICAgICAgICAgICBpZiAoIShzdGF0dXMgIT09IDApKSB7CiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxODsKICAgICAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJwdl9kb3duc2FtcGxlcl9pbml0IGZhaWxlZCB3aXRoIHN0YXR1cyAiLmNvbmNhdChzdGF0dXMpKTsKCiAgICAgICAgICAgICAgICBjYXNlIDE4OgogICAgICAgICAgICAgICAgICBtZW1vcnlCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KG1lbW9yeS5idWZmZXIpOwogICAgICAgICAgICAgICAgICBvYmplY3RBZGRyZXNzID0gbWVtb3J5QnVmZmVyVmlldy5nZXRJbnQzMihvYmplY3RBZGRyZXNzQWRkcmVzcywgdHJ1ZSk7CiAgICAgICAgICAgICAgICAgIGlucHV0ZnJhbWVMZW5ndGggPSBwdkRvd25zYW1wbGVyQ29udmVydE51bVNhbXBsZXNUb0lucHV0U2FtcGxlUmF0ZShvYmplY3RBZGRyZXNzLCBmcmFtZUxlbmd0aCk7CiAgICAgICAgICAgICAgICAgIGlucHV0QnVmZmVyQWRkcmVzcyA9IGFsaWduZWRBbGxvYyhJbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCBpbnB1dGZyYW1lTGVuZ3RoICogSW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7CgogICAgICAgICAgICAgICAgICBpZiAoIShpbnB1dEJ1ZmZlckFkZHJlc3MgPT09IDApKSB7CiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAyNDsKICAgICAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxsb2MgZmFpbGVkOiBDYW5ub3QgYWxsb2NhdGUgbWVtb3J5Jyk7CgogICAgICAgICAgICAgICAgY2FzZSAyNDoKICAgICAgICAgICAgICAgICAgb3V0cHV0QnVmZmVyQWRkcmVzcyA9IGFsaWduZWRBbGxvYyhJbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCBmcmFtZUxlbmd0aCAqIEludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQpOwoKICAgICAgICAgICAgICAgICAgaWYgKCEob3V0cHV0QnVmZmVyQWRkcmVzcyA9PT0gMCkpIHsKICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI3OwogICAgICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGxvYyBmYWlsZWQ6IENhbm5vdCBhbGxvY2F0ZSBtZW1vcnknKTsKCiAgICAgICAgICAgICAgICBjYXNlIDI3OgogICAgICAgICAgICAgICAgICBwdkRvd25zYW1wbGVyUmVzZXQgPSBpbnN0YW5jZS5leHBvcnRzLnB2RG93bnNhbXBsZXJSZXNldDsKICAgICAgICAgICAgICAgICAgcHZEb3duc2FtcGxlclByb2Nlc3MgPSBpbnN0YW5jZS5leHBvcnRzLnB2X2Rvd25zYW1wbGVyX3Byb2Nlc3M7CiAgICAgICAgICAgICAgICAgIHB2RG93bnNhbXBsZXJEZWxldGUgPSBpbnN0YW5jZS5leHBvcnRzLnB2X2Rvd25zYW1wbGVyX2RlbGV0ZTsKICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5hYnJ1cHQoInJldHVybiIsIHsKICAgICAgICAgICAgICAgICAgICBpbnB1dEJ1ZmZlckFkZHJlc3M6IGlucHV0QnVmZmVyQWRkcmVzcywKICAgICAgICAgICAgICAgICAgICBpbnB1dGZyYW1lTGVuZ3RoOiBpbnB1dGZyYW1lTGVuZ3RoLAogICAgICAgICAgICAgICAgICAgIG1lbW9yeTogbWVtb3J5LAogICAgICAgICAgICAgICAgICAgIG9iamVjdEFkZHJlc3M6IG9iamVjdEFkZHJlc3MsCiAgICAgICAgICAgICAgICAgICAgb3V0cHV0QnVmZmVyQWRkcmVzczogb3V0cHV0QnVmZmVyQWRkcmVzcywKICAgICAgICAgICAgICAgICAgICBwdkRvd25zYW1wbGVyQ29udmVydE51bVNhbXBsZXNUb0lucHV0U2FtcGxlUmF0ZTogcHZEb3duc2FtcGxlckNvbnZlcnROdW1TYW1wbGVzVG9JbnB1dFNhbXBsZVJhdGUsCiAgICAgICAgICAgICAgICAgICAgcHZEb3duc2FtcGxlckluaXQ6IHB2RG93bnNhbXBsZXJJbml0LAogICAgICAgICAgICAgICAgICAgIHB2RG93bnNhbXBsZXJQcm9jZXNzOiBwdkRvd25zYW1wbGVyUHJvY2VzcywKICAgICAgICAgICAgICAgICAgICBwdkRvd25zYW1wbGVyUmVzZXQ6IHB2RG93bnNhbXBsZXJSZXNldCwKICAgICAgICAgICAgICAgICAgICBwdkRvd25zYW1wbGVyRGVsZXRlOiBwdkRvd25zYW1wbGVyRGVsZXRlCiAgICAgICAgICAgICAgICAgIH0pOwoKICAgICAgICAgICAgICAgIGNhc2UgMzE6CiAgICAgICAgICAgICAgICBjYXNlICJlbmQiOgogICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQyLnN0b3AoKTsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgIH0sIF9jYWxsZWUyKTsKICAgICAgICB9KSk7CgogICAgICAgIGZ1bmN0aW9uIGluaXRXYXNtKF94NSwgX3g2LCBfeDcsIF94OCkgewogICAgICAgICAgcmV0dXJuIF9pbml0V2FzbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOwogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIGluaXRXYXNtOwogICAgICB9KCkKICAgIH1dKTsKCiAgICByZXR1cm4gRG93bnNhbXBsZXI7CiAgfSgpOwoKICB2YXIgUFZfRlJBTUVfTEVOR1RIID0gNTEyOwogIHZhciBQVl9TQU1QTEVfUkFURSA9IDE2MDAwOwogIHZhciBQVl9GSUxURVJfT1JERVIgPSA1MDsKCiAgdmFyIF9kb3duc2FtcGxlcjsKCiAgdmFyIF9vdXRwdXRmcmFtZUxlbmd0aDsKCiAgdmFyIF9vbGRJbnB1dEJ1ZmZlcjsKCiAgdmFyIF9vdXRwdXRCdWZmZXI7CgogIHZhciBfYXVkaW9EdW1wQWN0aXZlOwoKICB2YXIgX2F1ZGlvRHVtcEJ1ZmZlcjsKCiAgdmFyIF9hdWRpb0R1bXBCdWZmZXJJbmRleDsKCiAgdmFyIF9hdWRpb0R1bXBOdW1GcmFtZXM7CgogIGZ1bmN0aW9uIGluaXQoX3gpIHsKICAgIHJldHVybiBfaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOwogIH0KCiAgZnVuY3Rpb24gX2luaXQoKSB7CiAgICBfaW5pdCA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovcmVnZW5lcmF0b3IubWFyayhmdW5jdGlvbiBfY2FsbGVlKGlucHV0U2FtcGxlUmF0ZSkgewogICAgICB2YXIgb3V0cHV0U2FtcGxlUmF0ZSwKICAgICAgICAgIGZyYW1lTGVuZ3RoLAogICAgICAgICAgX2FyZ3MgPSBhcmd1bWVudHM7CiAgICAgIHJldHVybiByZWdlbmVyYXRvci53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7CiAgICAgICAgd2hpbGUgKDEpIHsKICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHsKICAgICAgICAgICAgY2FzZSAwOgogICAgICAgICAgICAgIG91dHB1dFNhbXBsZVJhdGUgPSBfYXJncy5sZW5ndGggPiAxICYmIF9hcmdzWzFdICE9PSB1bmRlZmluZWQgPyBfYXJnc1sxXSA6IFBWX1NBTVBMRV9SQVRFOwogICAgICAgICAgICAgIGZyYW1lTGVuZ3RoID0gX2FyZ3MubGVuZ3RoID4gMiAmJiBfYXJnc1syXSAhPT0gdW5kZWZpbmVkID8gX2FyZ3NbMl0gOiBQVl9GUkFNRV9MRU5HVEg7CgogICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGlucHV0U2FtcGxlUmF0ZSkpIHsKICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSA0OwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW5wdXRTYW1wbGVSYXRlIHZhbHVlOiAiLmNvbmNhdChpbnB1dFNhbXBsZVJhdGUsICIuIEV4cGVjdGVkIGludGVnZXIuIikpOwoKICAgICAgICAgICAgY2FzZSA0OgogICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG91dHB1dFNhbXBsZVJhdGUpKSB7CiAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gNjsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIG91dHB1dFNhbXBsZVJhdGUgdmFsdWU6ICIuY29uY2F0KG91dHB1dFNhbXBsZVJhdGUsICIuIEV4cGVjdGVkIGludGVnZXIuIikpOwoKICAgICAgICAgICAgY2FzZSA2OgogICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGZyYW1lTGVuZ3RoKSkgewogICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDg7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigiSW52YWxpZCBmcmFtZUxlbmd0aCB2YWx1ZTogIi5jb25jYXQoZnJhbWVMZW5ndGgsICIuIEV4cGVjdGVkIGludGVnZXIuIikpOwoKICAgICAgICAgICAgY2FzZSA4OgogICAgICAgICAgICAgIF9vdXRwdXRmcmFtZUxlbmd0aCA9IGZyYW1lTGVuZ3RoOwogICAgICAgICAgICAgIF9vbGRJbnB1dEJ1ZmZlciA9IG5ldyBJbnQxNkFycmF5KFtdKTsKICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTI7CiAgICAgICAgICAgICAgcmV0dXJuIERvd25zYW1wbGVyLmNyZWF0ZShpbnB1dFNhbXBsZVJhdGUsIG91dHB1dFNhbXBsZVJhdGUsIFBWX0ZJTFRFUl9PUkRFUiwgX291dHB1dGZyYW1lTGVuZ3RoKTsKCiAgICAgICAgICAgIGNhc2UgMTI6CiAgICAgICAgICAgICAgX2Rvd25zYW1wbGVyID0gX2NvbnRleHQuc2VudDsKICAgICAgICAgICAgICBwb3N0TWVzc2FnZSh7CiAgICAgICAgICAgICAgICBjb21tYW5kOiAnZHMtcmVhZHknCiAgICAgICAgICAgICAgfSwgdW5kZWZpbmVkKTsKCiAgICAgICAgICAgIGNhc2UgMTQ6CiAgICAgICAgICAgIGNhc2UgImVuZCI6CiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0sIF9jYWxsZWUpOwogICAgfSkpOwogICAgcmV0dXJuIF9pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7CiAgfQoKICBmdW5jdGlvbiBzdGFydEF1ZGlvRHVtcCgpIHsKICAgIHZhciBkdXJhdGlvbk1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAzMDAwOwogICAgX2F1ZGlvRHVtcE51bUZyYW1lcyA9IE1hdGguZmxvb3IoZHVyYXRpb25NcyAqIFBWX1NBTVBMRV9SQVRFIC8gMTAwMCAvIFBWX0ZSQU1FX0xFTkdUSCk7CiAgICBfYXVkaW9EdW1wQWN0aXZlID0gdHJ1ZTsKICAgIF9hdWRpb0R1bXBCdWZmZXJJbmRleCA9IDA7CiAgICBfYXVkaW9EdW1wQnVmZmVyID0gbmV3IEludDE2QXJyYXkoX2F1ZGlvRHVtcE51bUZyYW1lcyAqIF9vdXRwdXRmcmFtZUxlbmd0aCk7CiAgfQoKICBmdW5jdGlvbiBwcm9jZXNzQXVkaW8oaW5wdXRGcmFtZSkgewogICAgaWYgKGlucHV0RnJhbWUuY29uc3RydWN0b3IgIT09IEZsb2F0MzJBcnJheSkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW5wdXRGcmFtZSB0eXBlOiAiLmNvbmNhdChfdHlwZW9mKGlucHV0RnJhbWUpLCAiLiBFeHBlY3RlZCBGbG9hdDMyQXJyYXkuIikpOwogICAgfQoKICAgIHZhciBpbnB1dEJ1ZmZlciA9IG5ldyBJbnQxNkFycmF5KGlucHV0RnJhbWUubGVuZ3RoKTsKCiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0RnJhbWUubGVuZ3RoOyBpKyspIHsKICAgICAgaWYgKGlucHV0RnJhbWVbaV0gPCAwKSB7CiAgICAgICAgaW5wdXRCdWZmZXJbaV0gPSAweDgwMDAgKiBpbnB1dEZyYW1lW2ldOwogICAgICB9IGVsc2UgewogICAgICAgIGlucHV0QnVmZmVyW2ldID0gMHg3ZmZmICogaW5wdXRGcmFtZVtpXTsKICAgICAgfQogICAgfQoKICAgIHZhciBpbnB1dEJ1ZmZlckV4dGVuZGVkID0gbmV3IEludDE2QXJyYXkoX29sZElucHV0QnVmZmVyLmxlbmd0aCArIGlucHV0QnVmZmVyLmxlbmd0aCk7CiAgICBpbnB1dEJ1ZmZlckV4dGVuZGVkLnNldChfb2xkSW5wdXRCdWZmZXIpOwogICAgaW5wdXRCdWZmZXJFeHRlbmRlZC5zZXQoaW5wdXRCdWZmZXIsIF9vbGRJbnB1dEJ1ZmZlci5sZW5ndGgpOwogICAgX29sZElucHV0QnVmZmVyID0gbmV3IEludDE2QXJyYXkoW10pOwoKICAgIHdoaWxlIChpbnB1dEJ1ZmZlckV4dGVuZGVkLmxlbmd0aCA+IDApIHsKICAgICAgdmFyIG51bUlucHV0U2FtcGxlcyA9IF9kb3duc2FtcGxlci5nZXROdW1SZXF1aXJlZElucHV0U2FtcGxlcyhfb3V0cHV0ZnJhbWVMZW5ndGgpOwoKICAgICAgaWYgKG51bUlucHV0U2FtcGxlcyA+IGlucHV0QnVmZmVyRXh0ZW5kZWQubGVuZ3RoKSB7CiAgICAgICAgX29sZElucHV0QnVmZmVyID0gbmV3IEludDE2QXJyYXkoaW5wdXRCdWZmZXJFeHRlbmRlZC5sZW5ndGgpOwoKICAgICAgICBfb2xkSW5wdXRCdWZmZXIuc2V0KGlucHV0QnVmZmVyRXh0ZW5kZWQpOwoKICAgICAgICBpbnB1dEJ1ZmZlckV4dGVuZGVkID0gaW5wdXRCdWZmZXJFeHRlbmRlZC5zbGljZShpbnB1dEJ1ZmZlckV4dGVuZGVkLmxlbmd0aCk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgX291dHB1dEJ1ZmZlciA9IG5ldyBJbnQxNkFycmF5KF9vdXRwdXRmcmFtZUxlbmd0aCk7CgogICAgICAgIF9kb3duc2FtcGxlci5wcm9jZXNzKGlucHV0QnVmZmVyRXh0ZW5kZWQuc2xpY2UoMCwgbnVtSW5wdXRTYW1wbGVzKSwgbnVtSW5wdXRTYW1wbGVzLCBfb3V0cHV0QnVmZmVyKTsKCiAgICAgICAgaWYgKF9hdWRpb0R1bXBBY3RpdmUpIHsKICAgICAgICAgIF9hdWRpb0R1bXBCdWZmZXIuc2V0KF9vdXRwdXRCdWZmZXIsIF9hdWRpb0R1bXBCdWZmZXJJbmRleCAqIF9vdXRwdXRmcmFtZUxlbmd0aCk7CgogICAgICAgICAgX2F1ZGlvRHVtcEJ1ZmZlckluZGV4Kys7CgogICAgICAgICAgaWYgKF9hdWRpb0R1bXBCdWZmZXJJbmRleCA9PT0gX2F1ZGlvRHVtcE51bUZyYW1lcykgewogICAgICAgICAgICBfYXVkaW9EdW1wQWN0aXZlID0gZmFsc2U7CiAgICAgICAgICAgIHZhciBwY21CbG9iID0gbmV3IEJsb2IoW19hdWRpb0R1bXBCdWZmZXJdLCB7CiAgICAgICAgICAgICAgdHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScKICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICBjb21tYW5kOiAnYXVkaW9fZHVtcF9jb21wbGV0ZScsCiAgICAgICAgICAgICAgYmxvYjogcGNtQmxvYgogICAgICAgICAgICB9LCB1bmRlZmluZWQpOwogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgcG9zdE1lc3NhZ2UoewogICAgICAgICAgY29tbWFuZDogJ291dHB1dCcsCiAgICAgICAgICBvdXRwdXRGcmFtZTogX291dHB1dEJ1ZmZlcgogICAgICAgIH0sIHVuZGVmaW5lZCk7CiAgICAgICAgaW5wdXRCdWZmZXJFeHRlbmRlZCA9IGlucHV0QnVmZmVyRXh0ZW5kZWQuc2xpY2UobnVtSW5wdXRTYW1wbGVzKTsKICAgICAgfQogICAgfQogIH0KCiAgZnVuY3Rpb24gcmVzZXQoKSB7CiAgICBfZG93bnNhbXBsZXIucmVzZXQoKTsKCiAgICBfb2xkSW5wdXRCdWZmZXIgPSBuZXcgSW50MTZBcnJheShbXSk7CiAgfQoKICBvbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UoZXZlbnQpIHsKICAgIHN3aXRjaCAoZXZlbnQuZGF0YS5jb21tYW5kKSB7CiAgICAgIGNhc2UgJ2luaXQnOgogICAgICAgIGluaXQoZXZlbnQuZGF0YS5pbnB1dFNhbXBsZVJhdGUsIGV2ZW50LmRhdGEub3V0cHV0U2FtcGxlUmF0ZSwgZXZlbnQuZGF0YS5mcmFtZUxlbmd0aCk7CiAgICAgICAgYnJlYWs7CgogICAgICBjYXNlICdwcm9jZXNzJzoKICAgICAgICBwcm9jZXNzQXVkaW8oZXZlbnQuZGF0YS5pbnB1dEZyYW1lKTsKICAgICAgICBicmVhazsKCiAgICAgIGNhc2UgJ3Jlc2V0JzoKICAgICAgICByZXNldCgpOwogICAgICAgIGJyZWFrOwoKICAgICAgY2FzZSAnc3RhcnRfYXVkaW9fZHVtcCc6CiAgICAgICAgc3RhcnRBdWRpb0R1bXAoZXZlbnQuZGF0YS5kdXJhdGlvbk1zKTsKICAgICAgICBicmVhazsKCiAgICAgIGRlZmF1bHQ6CiAgICAgICAgY29uc29sZS53YXJuKCJVbmhhbmRsZWQgbWVzc2FnZSBpbiBkb3duc2FtcGxpbmdfd29ya2VyLnRzOiAiLmNvbmNhdChldmVudC5kYXRhLmNvbW1hbmQpKTsKICAgICAgICBicmVhazsKICAgIH0KICB9OwoKfSgpKTsKCg==', null, false);
    /* eslint-enable */

    var DownsamplerWorkerFactory = /*#__PURE__*/function () {
        function DownsamplerWorkerFactory() {
            _classCallCheck(this, DownsamplerWorkerFactory);
        }

        _createClass(DownsamplerWorkerFactory, null, [{
            key: "create",
            value: function () {
                var _create = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(inputFrequency, outputFrequency, frameLength) {
                    var downsamplingWorker, workerPromise;
                    return regenerator.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    downsamplingWorker = new WorkerFactory();
                                    downsamplingWorker.postMessage({
                                        command: 'init',
                                        inputSampleRate: inputFrequency,
                                        outputSampleRate: outputFrequency,
                                        frameLength: frameLength
                                    });
                                    workerPromise = new Promise(function (resolve, reject) {
                                        downsamplingWorker.onmessage = function (event) {
                                            if (event.data.command === 'ds-ready') {
                                                resolve(downsamplingWorker);
                                            }
                                        };
                                    });
                                    return _context.abrupt("return", workerPromise);

                                case 4:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee);
                }));

                function create(_x, _x2, _x3) {
                    return _create.apply(this, arguments);
                }

                return create;
            }()
        }]);

        return DownsamplerWorkerFactory;
    }();

    function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    var WebVoiceProcessor = /*#__PURE__*/function () {
        function WebVoiceProcessor(inputMediaStream, audioContext, audioSource, downsamplingWorker, options) {
            var _options$start,
                _this = this;

            _classCallCheck(this, WebVoiceProcessor);

            this._isReleased = false;
            this._audioDumpPromise = null;
            this._audioDumpResolve = null;
            this._audioDumpReject = null;
            this._mediaStream = inputMediaStream;

            if (options.engines === undefined) {
                this._engines = [];
            } else {
                this._engines = options.engines;
            }

            this._isRecording = (_options$start = options.start) !== null && _options$start !== void 0 ? _options$start : true;
            this._downsamplingWorker = downsamplingWorker;
            this._audioContext = audioContext;
            this._audioSource = audioSource;
            var node = audioContext.createScriptProcessor(4096, 1, 1);

            node.onaudioprocess = function (event) {
                if (!_this._isRecording) {
                    return;
                }

                downsamplingWorker.postMessage({
                    command: 'process',
                    inputFrame: event.inputBuffer.getChannelData(0)
                });
            };

            this._audioSource.connect(node);

            node.connect(this._audioContext.destination);

            downsamplingWorker.onmessage = function (event) {
                switch (event.data.command) {
                    case 'output':
                    {
                        var _iterator = _createForOfIteratorHelper(_this._engines),
                            _step;

                        try {
                            for (_iterator.s(); !(_step = _iterator.n()).done;) {
                                var engine = _step.value;
                                engine.postMessage({
                                    command: 'process',
                                    inputFrame: event.data.outputFrame
                                });
                            }
                        } catch (err) {
                            _iterator.e(err);
                        } finally {
                            _iterator.f();
                        }

                        break;
                    }

                    case 'audio_dump_complete':
                    {
                        _this._audioDumpResolve(event.data.blob);

                        _this._audioDumpPromise = null;
                        _this._audioDumpResolve = null;
                        _this._audioDumpReject = null;
                        break;
                    }

                    default:
                    {
                        console.warn("Received unexpected command: ".concat(event.data.command));
                        break;
                    }
                }
            };
        }

        _createClass(WebVoiceProcessor, [{
            key: "audioDump",
            value: function () {
                var _audioDump = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
                    var _this2 = this;

                    var durationMs,
                        _args = arguments;
                    return regenerator.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    durationMs = _args.length > 0 && _args[0] !== undefined ? _args[0] : 3000;

                                    if (!(this._audioDumpPromise !== null)) {
                                        _context.next = 3;
                                        break;
                                    }

                                    return _context.abrupt("return", Promise.reject('Audio dump already in progress'));

                                case 3:
                                    this._downsamplingWorker.postMessage({
                                        command: 'start_audio_dump',
                                        durationMs: durationMs
                                    });

                                    this._audioDumpPromise = new Promise(function (resolve, reject) {
                                        _this2._audioDumpResolve = resolve;
                                        _this2._audioDumpReject = reject;
                                    });
                                    return _context.abrupt("return", this._audioDumpPromise);

                                case 6:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function audioDump() {
                    return _audioDump.apply(this, arguments);
                }

                return audioDump;
            }()
        }, {
            key: "release",
            value: function () {
                var _release = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
                    var _iterator2, _step2, track;

                    return regenerator.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (this._isReleased) {
                                        _context2.next = 9;
                                        break;
                                    }

                                    this._isReleased = true;
                                    this._isRecording = false;

                                    this._downsamplingWorker.postMessage({
                                        command: 'reset'
                                    });

                                    this._downsamplingWorker.terminate();

                                    _iterator2 = _createForOfIteratorHelper(this._mediaStream.getTracks());

                                    try {
                                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                                            track = _step2.value;
                                            track.stop();
                                        }
                                    } catch (err) {
                                        _iterator2.e(err);
                                    } finally {
                                        _iterator2.f();
                                    }

                                    _context2.next = 9;
                                    return this._audioContext.close();

                                case 9:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function release() {
                    return _release.apply(this, arguments);
                }

                return release;
            }()
        }, {
            key: "start",
            value: function start() {
                this._isRecording = true;
            }
        }, {
            key: "pause",
            value: function pause() {
                this._isRecording = false;
            }
        }, {
            key: "resume",
            value: function resume() {
                this._isRecording = true;
            }
        }, {
            key: "audioContext",
            get: function get() {
                return this._audioContext;
            }
        }, {
            key: "audioSource",
            get: function get() {
                return this._audioSource;
            }
        }, {
            key: "mediaStream",
            get: function get() {
                return this._mediaStream;
            }
        }, {
            key: "isRecording",
            get: function get() {
                return this._isRecording;
            }
        }, {
            key: "isReleased",
            get: function get() {
                return this._isReleased;
            }
        }], [{
            key: "init",
            value: function () {
                var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(options) {
                    var microphoneStream, audioContext, audioSource, downsamplingWorker;
                    return regenerator.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.next = 2;
                                    return navigator.mediaDevices.getUserMedia({
                                        audio: true
                                    });

                                case 2:
                                    microphoneStream = _context3.sent;
                                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                    audioSource = audioContext.createMediaStreamSource(microphoneStream);
                                    _context3.next = 7;
                                    return DownsamplerWorkerFactory.create(audioSource.context.sampleRate, options.outputSampleRate, options.frameLength);

                                case 7:
                                    downsamplingWorker = _context3.sent;
                                    return _context3.abrupt("return", new WebVoiceProcessor(microphoneStream, audioContext, audioSource, downsamplingWorker, options));

                                case 9:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3);
                }));

                function init(_x) {
                    return _init.apply(this, arguments);
                }

                return init;
            }()
        }]);

        return WebVoiceProcessor;
    }();

    function _typeof(obj) {
        "@babel/helpers - typeof";

        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function _typeof(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }

        return _typeof(obj);
    }

    function browserCompatibilityCheck() {
        var _isSecureContext = window.isSecureContext;

        var _mediaDevices = navigator.mediaDevices !== undefined;

        var _webkitGetUserMedia = navigator.webkitGetUserMedia !== undefined;

        var _Worker = window.Worker !== undefined;

        var _WebAssembly = (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === 'object';

        var _AudioWorklet = typeof AudioWorklet === 'function';

        var _picovoice = _mediaDevices && _WebAssembly && _Worker;

        return {
            _picovoice: _picovoice,
            AudioWorklet: _AudioWorklet,
            isSecureContext: _isSecureContext,
            mediaDevices: _mediaDevices,
            WebAssembly: _WebAssembly,
            webKitGetUserMedia: _webkitGetUserMedia,
            Worker: _Worker
        };
    }

    exports.WebVoiceProcessor = WebVoiceProcessor;
    exports.browserCompatibilityCheck = browserCompatibilityCheck;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=index.js.map