var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../../../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x2, y2, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// ../../../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// ../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// ../../../node_modules/unenv/dist/runtime/node/internal/async_hooks/async-hook.mjs
var kInit, kBefore, kAfter, kDestroy, kPromiseResolve, _AsyncHook, createHook, executionAsyncId, executionAsyncResource, triggerAsyncId, asyncWrapProviders;
var init_async_hook = __esm({
  "../../../node_modules/unenv/dist/runtime/node/internal/async_hooks/async-hook.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    kInit = /* @__PURE__ */ Symbol("init");
    kBefore = /* @__PURE__ */ Symbol("before");
    kAfter = /* @__PURE__ */ Symbol("after");
    kDestroy = /* @__PURE__ */ Symbol("destroy");
    kPromiseResolve = /* @__PURE__ */ Symbol("promiseResolve");
    _AsyncHook = class {
      __unenv__ = true;
      _enabled = false;
      _callbacks = {};
      constructor(callbacks = {}) {
        this._callbacks = callbacks;
      }
      enable() {
        this._enabled = true;
        return this;
      }
      disable() {
        this._enabled = false;
        return this;
      }
      get [kInit]() {
        return this._callbacks.init;
      }
      get [kBefore]() {
        return this._callbacks.before;
      }
      get [kAfter]() {
        return this._callbacks.after;
      }
      get [kDestroy]() {
        return this._callbacks.destroy;
      }
      get [kPromiseResolve]() {
        return this._callbacks.promiseResolve;
      }
    };
    __name(_AsyncHook, "_AsyncHook");
    createHook = /* @__PURE__ */ __name(function createHook2(callbacks) {
      const asyncHook = new _AsyncHook(callbacks);
      return asyncHook;
    }, "createHook");
    executionAsyncId = /* @__PURE__ */ __name(function executionAsyncId2() {
      return 0;
    }, "executionAsyncId");
    executionAsyncResource = /* @__PURE__ */ __name(function() {
      return /* @__PURE__ */ Object.create(null);
    }, "executionAsyncResource");
    triggerAsyncId = /* @__PURE__ */ __name(function() {
      return 0;
    }, "triggerAsyncId");
    asyncWrapProviders = Object.assign(/* @__PURE__ */ Object.create(null), {
      NONE: 0,
      DIRHANDLE: 1,
      DNSCHANNEL: 2,
      ELDHISTOGRAM: 3,
      FILEHANDLE: 4,
      FILEHANDLECLOSEREQ: 5,
      BLOBREADER: 6,
      FSEVENTWRAP: 7,
      FSREQCALLBACK: 8,
      FSREQPROMISE: 9,
      GETADDRINFOREQWRAP: 10,
      GETNAMEINFOREQWRAP: 11,
      HEAPSNAPSHOT: 12,
      HTTP2SESSION: 13,
      HTTP2STREAM: 14,
      HTTP2PING: 15,
      HTTP2SETTINGS: 16,
      HTTPINCOMINGMESSAGE: 17,
      HTTPCLIENTREQUEST: 18,
      JSSTREAM: 19,
      JSUDPWRAP: 20,
      MESSAGEPORT: 21,
      PIPECONNECTWRAP: 22,
      PIPESERVERWRAP: 23,
      PIPEWRAP: 24,
      PROCESSWRAP: 25,
      PROMISE: 26,
      QUERYWRAP: 27,
      QUIC_ENDPOINT: 28,
      QUIC_LOGSTREAM: 29,
      QUIC_PACKET: 30,
      QUIC_SESSION: 31,
      QUIC_STREAM: 32,
      QUIC_UDP: 33,
      SHUTDOWNWRAP: 34,
      SIGNALWRAP: 35,
      STATWATCHER: 36,
      STREAMPIPE: 37,
      TCPCONNECTWRAP: 38,
      TCPSERVERWRAP: 39,
      TCPWRAP: 40,
      TTYWRAP: 41,
      UDPSENDWRAP: 42,
      UDPWRAP: 43,
      SIGINTWATCHDOG: 44,
      WORKER: 45,
      WORKERHEAPSNAPSHOT: 46,
      WRITEWRAP: 47,
      ZLIB: 48,
      CHECKPRIMEREQUEST: 49,
      PBKDF2REQUEST: 50,
      KEYPAIRGENREQUEST: 51,
      KEYGENREQUEST: 52,
      KEYEXPORTREQUEST: 53,
      CIPHERREQUEST: 54,
      DERIVEBITSREQUEST: 55,
      HASHREQUEST: 56,
      RANDOMBYTESREQUEST: 57,
      RANDOMPRIMEREQUEST: 58,
      SCRYPTREQUEST: 59,
      SIGNREQUEST: 60,
      TLSWRAP: 61,
      VERIFYREQUEST: 62
    });
  }
});

// ../../../node_modules/unenv/dist/runtime/node/async_hooks.mjs
var init_async_hooks = __esm({
  "../../../node_modules/unenv/dist/runtime/node/async_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_async_hook();
  }
});

// ../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs
var async_hooks_exports = {};
__export(async_hooks_exports, {
  AsyncLocalStorage: () => AsyncLocalStorage,
  AsyncResource: () => AsyncResource,
  asyncWrapProviders: () => asyncWrapProviders,
  createHook: () => createHook,
  default: () => async_hooks_default,
  executionAsyncId: () => executionAsyncId,
  executionAsyncResource: () => executionAsyncResource,
  triggerAsyncId: () => triggerAsyncId
});
var workerdAsyncHooks, AsyncLocalStorage, AsyncResource, async_hooks_default;
var init_async_hooks2 = __esm({
  "../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_async_hooks();
    init_async_hooks();
    workerdAsyncHooks = process.getBuiltinModule("node:async_hooks");
    ({ AsyncLocalStorage, AsyncResource } = workerdAsyncHooks);
    async_hooks_default = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      // @ts-expect-error @types/node is missing this one - this is a bug in typings
      asyncWrapProviders,
      createHook,
      executionAsyncId,
      executionAsyncResource,
      triggerAsyncId,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      AsyncLocalStorage,
      AsyncResource
    };
  }
});

// _worker.js/index.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = Promise.resolve().then(() => (init_async_hooks2(), async_hooks_exports)).then(({ AsyncLocalStorage: AsyncLocalStorage2 }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage2;
  const envAsyncLocalStorage = new AsyncLocalStorage2();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage2();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
        getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args),
        get: (_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property),
        set: (_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value)
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: () => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()),
      getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args),
      get: (_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property),
      set: (_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value)
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var at = Object.create;
var H = Object.defineProperty;
var nt = Object.getOwnPropertyDescriptor;
var it = Object.getOwnPropertyNames;
var ct = Object.getPrototypeOf;
var rt = Object.prototype.hasOwnProperty;
var M = /* @__PURE__ */ __name((t, e) => () => (t && (e = t(t = 0)), e), "M");
var V = /* @__PURE__ */ __name((t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), "V");
var ot = /* @__PURE__ */ __name((t, e, a, s) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let i of it(e))
      !rt.call(t, i) && i !== a && H(t, i, { get: () => e[i], enumerable: !(s = nt(e, i)) || s.enumerable });
  return t;
}, "ot");
var q = /* @__PURE__ */ __name((t, e, a) => (a = t != null ? at(ct(t)) : {}, ot(e || !t || !t.__esModule ? H(a, "default", { value: t, enumerable: true }) : a, t)), "q");
var y;
var p = M(() => {
  y = { collectedLocales: [] };
});
var h;
var u = M(() => {
  h = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^(?:/((?!_next/static|_next/image|favicon.ico).*))(?:/)?$", headers: { "Cache-Control": "public, max-age=0, must-revalidate" }, continue: true }, { src: "^/_next/static(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$", headers: { "Cache-Control": "public, max-age=31536000, immutable" }, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/packages/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/packages/[id].rsc?nxtPid=$nxtPid" }, { src: "^/packages/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/packages/[id]?nxtPid=$nxtPid" }, { src: "^/vendor\\-packages/(?<nxtPvendorId>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/vendor-packages/[vendorId].rsc?nxtPvendorId=$nxtPvendorId" }, { src: "^/vendor\\-packages/(?<nxtPvendorId>[^/]+?)(?:/)?$", dest: "/vendor-packages/[vendorId]?nxtPvendorId=$nxtPvendorId" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|iPfV56XhcLqulc_QENUzt)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/_not-found", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { version: "15.4.11" }, crons: [] };
});
var _;
var d = M(() => {
  _ = { "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/chunks/1089-95d7fec0e6507611.js": { type: "static" }, "/_next/static/chunks/1533-5349047765680d49.js": { type: "static" }, "/_next/static/chunks/2160-1c5fcec41db9a305.js": { type: "static" }, "/_next/static/chunks/2231-45fce8a64b9d031e.js": { type: "static" }, "/_next/static/chunks/2432-1bdd3840cd7f8164.js": { type: "static" }, "/_next/static/chunks/3078-3aeb7be444e83fac.js": { type: "static" }, "/_next/static/chunks/3212-2af52c3628af292d.js": { type: "static" }, "/_next/static/chunks/3357-6016e0101fa60df8.js": { type: "static" }, "/_next/static/chunks/4361-f66ec628ed5a32b9.js": { type: "static" }, "/_next/static/chunks/4623-24256fd465f5ba01.js": { type: "static" }, "/_next/static/chunks/4bd1b696-602635ee57868870.js": { type: "static" }, "/_next/static/chunks/5192-c279bfbd742b15e7.js": { type: "static" }, "/_next/static/chunks/5508-bbb438cdb8a3cc13.js": { type: "static" }, "/_next/static/chunks/5964-f16c84da744051ad.js": { type: "static" }, "/_next/static/chunks/7708-6ea1d9f7b183a6d7.js": { type: "static" }, "/_next/static/chunks/7902-9274dcd7f623b1c7.js": { type: "static" }, "/_next/static/chunks/9368-f2f28f9004798ca4.js": { type: "static" }, "/_next/static/chunks/9510-6dad814cc5cf92ad.js": { type: "static" }, "/_next/static/chunks/9884-2b1af6a64699b53f.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/about/page-8bf3e94033637976.js": { type: "static" }, "/_next/static/chunks/app/contact/page-646050873b66688d.js": { type: "static" }, "/_next/static/chunks/app/contact-us/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/contact-us/page-7b12f1ff9527e2a8.js": { type: "static" }, "/_next/static/chunks/app/corporate/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/corporate/page-c33964a7a4119260.js": { type: "static" }, "/_next/static/chunks/app/cruises/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/cruises/page-78d50386f2c445dd.js": { type: "static" }, "/_next/static/chunks/app/destinations/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/destinations/page-156cc15dc0fecf7f.js": { type: "static" }, "/_next/static/chunks/app/faq/page-51e70f43168107d8.js": { type: "static" }, "/_next/static/chunks/app/hotels/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/hotels/page-b54b39248f69f9e1.js": { type: "static" }, "/_next/static/chunks/app/idl/page-eadac4a33fbed8a5.js": { type: "static" }, "/_next/static/chunks/app/itinerary-builder/page-c181e19d73cfefb2.js": { type: "static" }, "/_next/static/chunks/app/layout-b204aa50bb6797d9.js": { type: "static" }, "/_next/static/chunks/app/login/page-674767b22dfe1ad1.js": { type: "static" }, "/_next/static/chunks/app/not-found-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/packages/[id]/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/packages/[id]/page-776f5329670b0895.js": { type: "static" }, "/_next/static/chunks/app/page-0fc108445f320e28.js": { type: "static" }, "/_next/static/chunks/app/private-jets/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/private-jets/page-113525a6c53e6eac.js": { type: "static" }, "/_next/static/chunks/app/profile/page-97ea2874767b0d13.js": { type: "static" }, "/_next/static/chunks/app/robots.txt/route-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/services/page-5a967a6322071d2e.js": { type: "static" }, "/_next/static/chunks/app/sitemap.xml/route-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/support/page-4a9197010751aa5e.js": { type: "static" }, "/_next/static/chunks/app/test-page/page-646050873b66688d.js": { type: "static" }, "/_next/static/chunks/app/tours/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/tours/page-3f1c4329217479df.js": { type: "static" }, "/_next/static/chunks/app/vendor-packages/[vendorId]/page-d6ac35ccd7c5d386.js": { type: "static" }, "/_next/static/chunks/app/visa/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/visa/page-d3dc2bbd15ba6fa3.js": { type: "static" }, "/_next/static/chunks/app/yachts/layout-c96a9051de5ed104.js": { type: "static" }, "/_next/static/chunks/app/yachts/page-923628ff274f5ef0.js": { type: "static" }, "/_next/static/chunks/framework-c5e53ed6ab70e0ac.js": { type: "static" }, "/_next/static/chunks/main-2baa32ee79f3c96b.js": { type: "static" }, "/_next/static/chunks/main-app-147e0223fe507b97.js": { type: "static" }, "/_next/static/chunks/pages/_app-e934d87da5baeb95.js": { type: "static" }, "/_next/static/chunks/pages/_error-1b76d02a45a765cb.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-9f4366e6173326dc.js": { type: "static" }, "/_next/static/css/9fa9259aa707578a.css": { type: "static" }, "/_next/static/css/bf1b2ce0c43c5d3f.css": { type: "static" }, "/_next/static/iPfV56XhcLqulc_QENUzt/_buildManifest.js": { type: "static" }, "/_next/static/iPfV56XhcLqulc_QENUzt/_ssgManifest.js": { type: "static" }, "/_next/static/media/15d260b61f754cb1-s.woff2": { type: "static" }, "/_next/static/media/19cfc7226ec3afaa-s.woff2": { type: "static" }, "/_next/static/media/1b35baa265633d0f-s.woff2": { type: "static" }, "/_next/static/media/1bc069ec0c72b6e8-s.p.woff2": { type: "static" }, "/_next/static/media/1f173e5e25f3efee-s.woff2": { type: "static" }, "/_next/static/media/21350d82a1f187e9-s.woff2": { type: "static" }, "/_next/static/media/2a0e1257fe2cd3b0-s.woff2": { type: "static" }, "/_next/static/media/2c13fb54ab30493e-s.woff2": { type: "static" }, "/_next/static/media/3fd092111243d8b4-s.woff2": { type: "static" }, "/_next/static/media/48e2044251ef3125-s.woff2": { type: "static" }, "/_next/static/media/4c33fe3e32cc3c9d-s.woff2": { type: "static" }, "/_next/static/media/4d6bfb8f87c2d798-s.p.woff2": { type: "static" }, "/_next/static/media/5622b922c8e9159d-s.p.woff2": { type: "static" }, "/_next/static/media/636a5ac981f94f8b-s.p.woff2": { type: "static" }, "/_next/static/media/669815d078e69076-s.woff2": { type: "static" }, "/_next/static/media/6f27bb8624cfcab0-s.woff2": { type: "static" }, "/_next/static/media/6fe53d21e6e7ebd8-s.woff2": { type: "static" }, "/_next/static/media/8e9860b6e62d6359-s.woff2": { type: "static" }, "/_next/static/media/8ebc6e9dde468c4a-s.woff2": { type: "static" }, "/_next/static/media/904be59b21bd51cb-s.p.woff2": { type: "static" }, "/_next/static/media/9e7b0a821b9dfcb4-s.woff2": { type: "static" }, "/_next/static/media/Background (1).27020330.png": { type: "static" }, "/_next/static/media/Background new.05d40e26.png": { type: "static" }, "/_next/static/media/Background.1fa60181.png": { type: "static" }, "/_next/static/media/Cruise.09284246.png": { type: "static" }, "/_next/static/media/IATA.7bc51d69.png": { type: "static" }, "/_next/static/media/INNER PAGE BANNER.eec0b297.png": { type: "static" }, "/_next/static/media/Image 4.b06d2106.png": { type: "static" }, "/_next/static/media/Image.76ff9753.png": { type: "static" }, "/_next/static/media/Rectangle 640.3582fceb.png": { type: "static" }, "/_next/static/media/Rectangle 642.b61778f8.png": { type: "static" }, "/_next/static/media/Section.4b048da4.png": { type: "static" }, "/_next/static/media/Trophy.c231022a.png": { type: "static" }, "/_next/static/media/airline_background.90975553.png": { type: "static" }, "/_next/static/media/airoplane.2bbca53a.png": { type: "static" }, "/_next/static/media/b1f344208eb4edfe-s.woff2": { type: "static" }, "/_next/static/media/ba9851c3c22cd980-s.woff2": { type: "static" }, "/_next/static/media/bf24a9759715e608-s.woff2": { type: "static" }, "/_next/static/media/blog1.194b8f99.jpg": { type: "static" }, "/_next/static/media/blog2.3df2be06.jpg": { type: "static" }, "/_next/static/media/blog3.34a7755b.jpg": { type: "static" }, "/_next/static/media/booking-img.2cc8e3c8.png": { type: "static" }, "/_next/static/media/booking_policy.9ae64d68.png": { type: "static" }, "/_next/static/media/c16b5286b4d7df09-s.woff2": { type: "static" }, "/_next/static/media/c5fe6dc8356a8c31-s.woff2": { type: "static" }, "/_next/static/media/call_icon.02b7ef7a.png": { type: "static" }, "/_next/static/media/cancellation_policy.f9af1cc4.png": { type: "static" }, "/_next/static/media/cb77fa977ec4e115-s.woff2": { type: "static" }, "/_next/static/media/collab_frame.419ba026.png": { type: "static" }, "/_next/static/media/d9fef5bf2f64cf9a-s.woff2": { type: "static" }, "/_next/static/media/date_icon.83ffb9f5.png": { type: "static" }, "/_next/static/media/de42cfb9a3b980ae-s.p.woff2": { type: "static" }, "/_next/static/media/df0a9ae256c0569c-s.woff2": { type: "static" }, "/_next/static/media/discount.png.df0c19a0.png": { type: "static" }, "/_next/static/media/e4af272ccee01ff0-s.p.woff2": { type: "static" }, "/_next/static/media/e6ce41475daf6113-s.woff2": { type: "static" }, "/_next/static/media/facebook_icon.bb645232.png": { type: "static" }, "/_next/static/media/flag_detail.0a78212b.png": { type: "static" }, "/_next/static/media/flight.5e6ce96a.png": { type: "static" }, "/_next/static/media/flight_icon_package_card.31ff4423.png": { type: "static" }, "/_next/static/media/flight_route.05435d33.png": { type: "static" }, "/_next/static/media/food_icon_package_card.6008972b.png": { type: "static" }, "/_next/static/media/form-background.0163bc86.png": { type: "static" }, "/_next/static/media/global.51672d1e.png": { type: "static" }, "/_next/static/media/google_plus_icon.4ebbcf24.png": { type: "static" }, "/_next/static/media/gutter.599d6650.png": { type: "static" }, "/_next/static/media/headIcon.4ccb3a23.png": { type: "static" }, "/_next/static/media/hotel1.57809683.png": { type: "static" }, "/_next/static/media/hotels_package_card.02eab40d.png": { type: "static" }, "/_next/static/media/img (1).746d2f1c.png": { type: "static" }, "/_next/static/media/img (2).f2025f71.png": { type: "static" }, "/_next/static/media/img (3).38486ddf.png": { type: "static" }, "/_next/static/media/img (4).a994c949.png": { type: "static" }, "/_next/static/media/img (5).0dd89acc.png": { type: "static" }, "/_next/static/media/img.5c39a1c0.png": { type: "static" }, "/_next/static/media/instagram_icon.0bc0f2c5.png": { type: "static" }, "/_next/static/media/jet.7964c8c2.png": { type: "static" }, "/_next/static/media/link_icon.f47da361.png": { type: "static" }, "/_next/static/media/link_image_01.ed9c6d20.png": { type: "static" }, "/_next/static/media/link_image_02.03633b0e.png": { type: "static" }, "/_next/static/media/link_image_03.bcae1192.png": { type: "static" }, "/_next/static/media/location_icon.ffadf6d5.png": { type: "static" }, "/_next/static/media/logo.083f8772.png": { type: "static" }, "/_next/static/media/luggageIcon.364aeb97.png": { type: "static" }, "/_next/static/media/manClimbing.1b4e1754.png": { type: "static" }, "/_next/static/media/offer.4dcf4cae.png": { type: "static" }, "/_next/static/media/offer_icon.025f23c0.png": { type: "static" }, "/_next/static/media/plain_icon.dc726559.png": { type: "static" }, "/_next/static/media/planeroute.849839ca.png": { type: "static" }, "/_next/static/media/private-jet-1.5bac3ae2.png": { type: "static" }, "/_next/static/media/private-jet-2.ae0826d5.png": { type: "static" }, "/_next/static/media/search.4ac34d9d.png": { type: "static" }, "/_next/static/media/shape.18abe350.png": { type: "static" }, "/_next/static/media/tentIcon.21d9cf77.png": { type: "static" }, "/_next/static/media/thumbsUpIcon.c77d1710.png": { type: "static" }, "/_next/static/media/train_icon.77621457.png": { type: "static" }, "/_next/static/media/travelbag.19ab6bac.png": { type: "static" }, "/_next/static/media/travelboy.6793387d.png": { type: "static" }, "/_next/static/media/twitter_icon.f35a664b.png": { type: "static" }, "/_next/static/media/wandersofqadar.af592eb3.png": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/_redirects": { type: "static" }, "/vite.svg": { type: "static" }, "/_not-found": { type: "function", entrypoint: "__next-on-pages-dist__/functions/_not-found.func.js" }, "/_not-found.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/_not-found.func.js" }, "/about": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/about.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/contact-us": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact-us.func.js" }, "/contact-us.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact-us.func.js" }, "/contact": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact.func.js" }, "/contact.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact.func.js" }, "/corporate": { type: "function", entrypoint: "__next-on-pages-dist__/functions/corporate.func.js" }, "/corporate.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/corporate.func.js" }, "/cruises": { type: "function", entrypoint: "__next-on-pages-dist__/functions/cruises.func.js" }, "/cruises.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/cruises.func.js" }, "/destinations": { type: "function", entrypoint: "__next-on-pages-dist__/functions/destinations.func.js" }, "/destinations.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/destinations.func.js" }, "/faq": { type: "function", entrypoint: "__next-on-pages-dist__/functions/faq.func.js" }, "/faq.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/faq.func.js" }, "/hotels": { type: "function", entrypoint: "__next-on-pages-dist__/functions/hotels.func.js" }, "/hotels.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/hotels.func.js" }, "/idl": { type: "function", entrypoint: "__next-on-pages-dist__/functions/idl.func.js" }, "/idl.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/idl.func.js" }, "/index": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/index.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/itinerary-builder": { type: "function", entrypoint: "__next-on-pages-dist__/functions/itinerary-builder.func.js" }, "/itinerary-builder.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/itinerary-builder.func.js" }, "/login": { type: "function", entrypoint: "__next-on-pages-dist__/functions/login.func.js" }, "/login.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/login.func.js" }, "/packages/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/packages/[id].func.js" }, "/packages/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/packages/[id].func.js" }, "/private-jets": { type: "function", entrypoint: "__next-on-pages-dist__/functions/private-jets.func.js" }, "/private-jets.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/private-jets.func.js" }, "/profile": { type: "function", entrypoint: "__next-on-pages-dist__/functions/profile.func.js" }, "/profile.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/profile.func.js" }, "/services": { type: "function", entrypoint: "__next-on-pages-dist__/functions/services.func.js" }, "/services.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/services.func.js" }, "/sitemap.xml": { type: "function", entrypoint: "__next-on-pages-dist__/functions/sitemap.xml.func.js" }, "/sitemap.xml.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/sitemap.xml.func.js" }, "/support": { type: "function", entrypoint: "__next-on-pages-dist__/functions/support.func.js" }, "/support.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/support.func.js" }, "/test-page": { type: "function", entrypoint: "__next-on-pages-dist__/functions/test-page.func.js" }, "/test-page.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/test-page.func.js" }, "/tours": { type: "function", entrypoint: "__next-on-pages-dist__/functions/tours.func.js" }, "/tours.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/tours.func.js" }, "/vendor-packages/[vendorId]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/vendor-packages/[vendorId].func.js" }, "/vendor-packages/[vendorId].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/vendor-packages/[vendorId].func.js" }, "/visa": { type: "function", entrypoint: "__next-on-pages-dist__/functions/visa.func.js" }, "/visa.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/visa.func.js" }, "/yachts": { type: "function", entrypoint: "__next-on-pages-dist__/functions/yachts.func.js" }, "/yachts.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/yachts.func.js" }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/icon.png": { type: "override", path: "/icon.png", headers: { "cache-control": "public, immutable, no-transform, max-age=31536000", "content-type": "image/png", "x-next-cache-tags": "_N_T_/layout,_N_T_/icon.png/layout,_N_T_/icon.png/route,_N_T_/icon.png", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/robots.txt": { type: "override", path: "/robots.txt", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } } };
});
var F = V((Wt, $) => {
  "use strict";
  p();
  u();
  d();
  function b(t, e) {
    t = String(t || "").trim();
    let a = t, s, i = "";
    if (/^[^a-zA-Z\\\s]/.test(t)) {
      s = t[0];
      let r = t.lastIndexOf(s);
      i += t.substring(r + 1), t = t.substring(1, r);
    }
    let n = 0;
    return t = dt(t, (r) => {
      if (/^\(\?[P<']/.test(r)) {
        let o = /^\(\?P?[<']([^>']+)[>']/.exec(r);
        if (!o)
          throw new Error(`Failed to extract named captures from ${JSON.stringify(r)}`);
        let l = r.substring(o[0].length, r.length - 1);
        return e && (e[n] = o[1]), n++, `(${l})`;
      }
      return r.substring(0, 3) === "(?:" || n++, r;
    }), t = t.replace(/\[:([^:]+):\]/g, (r, o) => b.characterClasses[o] || r), new b.PCRE(t, i, a, i, s);
  }
  __name(b, "b");
  function dt(t, e) {
    let a = 0, s = 0, i = false;
    for (let c = 0; c < t.length; c++) {
      let n = t[c];
      if (i) {
        i = false;
        continue;
      }
      switch (n) {
        case "(":
          s === 0 && (a = c), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let r = c + 1, o = a === 0 ? "" : t.substring(0, a), l = t.substring(r), f = String(e(t.substring(a, r)));
            t = o + f + l, c = a;
          }
          break;
        case "\\":
          i = true;
          break;
        default:
          break;
      }
    }
    return t;
  }
  __name(dt, "dt");
  (function(t) {
    class e extends RegExp {
      constructor(s, i, c, n, r) {
        super(s, i), this.pcrePattern = c, this.pcreFlags = n, this.delimiter = r;
      }
    }
    __name(e, "e");
    t.PCRE = e, t.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(b || (b = {}));
  b.prototype = b.PCRE.prototype;
  $.exports = b;
});
var Q = V((U) => {
  "use strict";
  p();
  u();
  d();
  U.parse = vt;
  U.serialize = kt;
  var Rt = Object.prototype.toString, E = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function vt(t, e) {
    if (typeof t != "string")
      throw new TypeError("argument str must be a string");
    for (var a = {}, s = e || {}, i = s.decode || Pt, c = 0; c < t.length; ) {
      var n = t.indexOf("=", c);
      if (n === -1)
        break;
      var r = t.indexOf(";", c);
      if (r === -1)
        r = t.length;
      else if (r < n) {
        c = t.lastIndexOf(";", n - 1) + 1;
        continue;
      }
      var o = t.slice(c, n).trim();
      if (a[o] === void 0) {
        var l = t.slice(n + 1, r).trim();
        l.charCodeAt(0) === 34 && (l = l.slice(1, -1)), a[o] = Ct(l, i);
      }
      c = r + 1;
    }
    return a;
  }
  __name(vt, "vt");
  function kt(t, e, a) {
    var s = a || {}, i = s.encode || jt;
    if (typeof i != "function")
      throw new TypeError("option encode is invalid");
    if (!E.test(t))
      throw new TypeError("argument name is invalid");
    var c = i(e);
    if (c && !E.test(c))
      throw new TypeError("argument val is invalid");
    var n = t + "=" + c;
    if (s.maxAge != null) {
      var r = s.maxAge - 0;
      if (isNaN(r) || !isFinite(r))
        throw new TypeError("option maxAge is invalid");
      n += "; Max-Age=" + Math.floor(r);
    }
    if (s.domain) {
      if (!E.test(s.domain))
        throw new TypeError("option domain is invalid");
      n += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!E.test(s.path))
        throw new TypeError("option path is invalid");
      n += "; Path=" + s.path;
    }
    if (s.expires) {
      var o = s.expires;
      if (!St(o) || isNaN(o.valueOf()))
        throw new TypeError("option expires is invalid");
      n += "; Expires=" + o.toUTCString();
    }
    if (s.httpOnly && (n += "; HttpOnly"), s.secure && (n += "; Secure"), s.priority) {
      var l = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (l) {
        case "low":
          n += "; Priority=Low";
          break;
        case "medium":
          n += "; Priority=Medium";
          break;
        case "high":
          n += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var f = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (f) {
        case true:
          n += "; SameSite=Strict";
          break;
        case "lax":
          n += "; SameSite=Lax";
          break;
        case "strict":
          n += "; SameSite=Strict";
          break;
        case "none":
          n += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return n;
  }
  __name(kt, "kt");
  function Pt(t) {
    return t.indexOf("%") !== -1 ? decodeURIComponent(t) : t;
  }
  __name(Pt, "Pt");
  function jt(t) {
    return encodeURIComponent(t);
  }
  __name(jt, "jt");
  function St(t) {
    return Rt.call(t) === "[object Date]" || t instanceof Date;
  }
  __name(St, "St");
  function Ct(t, e) {
    try {
      return e(t);
    } catch {
      return t;
    }
  }
  __name(Ct, "Ct");
});
p();
u();
d();
p();
u();
d();
p();
u();
d();
var R = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
p();
u();
d();
p();
u();
d();
p();
u();
d();
p();
u();
d();
var D = q(F());
function j(t, e, a) {
  if (e == null)
    return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", i = [];
  return { match: (0, D.default)(`%${t}%${s}`, i).exec(e), captureGroupKeys: i };
}
__name(j, "j");
function v(t, e, a, { namedOnly: s } = {}) {
  return t.replace(/\$([a-zA-Z0-9_]+)/g, (i, c) => {
    let n = a.indexOf(c);
    return s && n === -1 ? i : (n === -1 ? e[parseInt(c, 10)] : e[n + 1]) || "";
  });
}
__name(v, "v");
function N(t, { url: e, cookies: a, headers: s, routeDest: i }) {
  switch (t.type) {
    case "host":
      return { valid: e.hostname === t.value };
    case "header":
      return t.value !== void 0 ? I(t.value, s.get(t.key), i) : { valid: s.has(t.key) };
    case "cookie": {
      let c = a[t.key];
      return c && t.value !== void 0 ? I(t.value, c, i) : { valid: c !== void 0 };
    }
    case "query":
      return t.value !== void 0 ? I(t.value, e.searchParams.get(t.key), i) : { valid: e.searchParams.has(t.key) };
  }
}
__name(N, "N");
function I(t, e, a) {
  let { match: s, captureGroupKeys: i } = j(t, e);
  return a && s && i.length ? { valid: !!s, newRouteDest: v(a, s, i, { namedOnly: true }) } : { valid: !!s };
}
__name(I, "I");
p();
u();
d();
function B(t) {
  let e = new Headers(t.headers);
  return t.cf && (e.set("x-vercel-ip-city", encodeURIComponent(t.cf.city)), e.set("x-vercel-ip-country", t.cf.country), e.set("x-vercel-ip-country-region", t.cf.regionCode), e.set("x-vercel-ip-latitude", t.cf.latitude), e.set("x-vercel-ip-longitude", t.cf.longitude)), e.set("x-vercel-sc-host", R), new Request(t, { headers: e });
}
__name(B, "B");
p();
u();
d();
function m(t, e, a) {
  let s = e instanceof Headers ? e.entries() : Object.entries(e);
  for (let [i, c] of s) {
    let n = i.toLowerCase(), r = a?.match ? v(c, a.match, a.captureGroupKeys) : c;
    n === "set-cookie" ? t.append(n, r) : t.set(n, r);
  }
}
__name(m, "m");
function k(t) {
  return /^https?:\/\//.test(t);
}
__name(k, "k");
function x(t, e) {
  for (let [a, s] of e.entries()) {
    let i = /^nxtP(.+)$/.exec(a), c = /^nxtI(.+)$/.exec(a);
    i?.[1] ? (t.set(a, s), t.set(i[1], s)) : c?.[1] ? t.set(c[1], s.replace(/(\(\.+\))+/, "")) : (!t.has(a) || !!s && !t.getAll(a).includes(s)) && t.append(a, s);
  }
}
__name(x, "x");
function A(t, e) {
  let a = new URL(e, t.url);
  return x(a.searchParams, new URL(t.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, t);
}
__name(A, "A");
function P(t) {
  return new Response(t.body, t);
}
__name(P, "P");
function L(t) {
  return t.split(",").map((e) => {
    let [a, s] = e.split(";"), i = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(i) ? 1 : i];
  }).sort((e, a) => a[1] - e[1]).map(([e]) => e === "*" || e === "" ? [] : e).flat();
}
__name(L, "L");
p();
u();
d();
function O(t) {
  switch (t) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function S(t, { request: e, assetsFetcher: a, ctx: s }, { path: i, searchParams: c }) {
  let n, r = new URL(e.url);
  x(r.searchParams, c);
  let o = new Request(r, e);
  try {
    switch (t?.type) {
      case "function":
      case "middleware": {
        let l = await import(t.entrypoint);
        try {
          n = await l.default(o, s);
        } catch (f) {
          let g = f;
          throw g.name === "TypeError" && g.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${t.entrypoint})`) : f;
        }
        break;
      }
      case "override": {
        n = P(await a.fetch(A(o, t.path ?? i))), t.headers && m(n.headers, t.headers);
        break;
      }
      case "static": {
        n = await a.fetch(A(o, i));
        break;
      }
      default:
        n = new Response("Not Found", { status: 404 });
    }
  } catch (l) {
    return console.error(l), new Response("Internal Server Error", { status: 500 });
  }
  return P(n);
}
__name(S, "S");
function G(t, e) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !t.startsWith(a) || !t.endsWith(s) ? false : t.slice(a.length, -s.length).split("|").every((c) => e.has(c));
}
__name(G, "G");
p();
u();
d();
function lt(t, { protocol: e, hostname: a, port: s, pathname: i }) {
  return !(e && t.protocol.replace(/:$/, "") !== e || !new RegExp(a).test(t.hostname) || s && !new RegExp(s).test(t.port) || i && !new RegExp(i).test(t.pathname));
}
__name(lt, "lt");
function ft(t, e) {
  if (t.method !== "GET")
    return;
  let { origin: a, searchParams: s } = new URL(t.url), i = s.get("url"), c = Number.parseInt(s.get("w") ?? "", 10), n = Number.parseInt(s.get("q") ?? "75", 10);
  if (!i || Number.isNaN(c) || Number.isNaN(n) || !e?.sizes?.includes(c) || n < 0 || n > 100)
    return;
  let r = new URL(i, a);
  if (r.pathname.endsWith(".svg") && !e?.dangerouslyAllowSVG)
    return;
  let o = i.startsWith("//"), l = i.startsWith("/") && !o;
  if (!l && !e?.domains?.includes(r.hostname) && !e?.remotePatterns?.find((w) => lt(r, w)))
    return;
  let f = t.headers.get("Accept") ?? "", g = e?.formats?.find((w) => f.includes(w))?.replace("image/", "");
  return { isRelative: l, imageUrl: r, options: { width: c, quality: n, format: g } };
}
__name(ft, "ft");
function ht(t, e, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let c = e.pathname.split("/").pop(), n = c ? `${a.contentDispositionType}; filename="${c}"` : a.contentDispositionType;
    s.set("Content-Disposition", n);
  }
  t.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let i = P(t);
  return m(i.headers, s), i;
}
__name(ht, "ht");
async function z(t, { buildOutput: e, assetsFetcher: a, imagesConfig: s }) {
  let i = ft(t, s);
  if (!i)
    return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: c, imageUrl: n } = i, o = await (c && n.pathname in e ? a.fetch.bind(a) : fetch)(n);
  return ht(o, n, s);
}
__name(z, "z");
p();
u();
d();
p();
u();
d();
p();
u();
d();
async function C(t) {
  return import(t);
}
__name(C, "C");
var _t = "x-vercel-cache-tags";
var yt = "x-next-cache-soft-tags";
var gt = Symbol.for("__cloudflare-request-context__");
async function J(t) {
  let e = `https://${R}/v1/suspense-cache/`;
  if (!t.url.startsWith(e))
    return null;
  try {
    let a = new URL(t.url), s = await mt();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let c = a.searchParams.get("tags")?.split(",") ?? [];
      for (let n of c)
        await s.revalidateTag(n);
      return new Response(null, { status: 200 });
    }
    let i = a.pathname.replace("/v1/suspense-cache/", "");
    if (!i.length)
      return new Response("Invalid cache key", { status: 400 });
    switch (t.method) {
      case "GET": {
        let c = W(t, yt), n = await s.get(i, { softTags: c });
        return n ? new Response(JSON.stringify(n.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (n.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let c = globalThis[gt], n = /* @__PURE__ */ __name(async () => {
          let r = await t.json();
          r.data.tags === void 0 && (r.tags ??= W(t, _t) ?? []), await s.set(i, r);
        }, "n");
        return c ? c.ctx.waitUntil(n()) : await n(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function mt() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(mt, "mt");
async function K(t) {
  let e = `./__next-on-pages-dist__/cache/${t}.js`, a = await C(e);
  return new a.default();
}
__name(K, "K");
function W(t, e) {
  return t.headers.get(e)?.split(",")?.filter(Boolean);
}
__name(W, "W");
function Z() {
  globalThis[X] || (xt(), globalThis[X] = true);
}
__name(Z, "Z");
function xt() {
  let t = globalThis.fetch;
  globalThis.fetch = async (...e) => {
    let a = new Request(...e), s = await bt(a);
    return s || (s = await J(a), s) ? s : (wt(a), t(a));
  };
}
__name(xt, "xt");
async function bt(t) {
  if (t.url.startsWith("blob:"))
    try {
      let a = `./__next-on-pages-dist__/assets/${new URL(t.url).pathname}.bin`, s = (await C(a)).default, i = { async arrayBuffer() {
        return s;
      }, get body() {
        return new ReadableStream({ start(c) {
          let n = Buffer.from(s);
          c.enqueue(n), c.close();
        } });
      }, async text() {
        return Buffer.from(s).toString();
      }, async json() {
        let c = Buffer.from(s);
        return JSON.stringify(c.toString());
      }, async blob() {
        return new Blob(s);
      } };
      return i.clone = () => ({ ...i }), i;
    } catch {
    }
  return null;
}
__name(bt, "bt");
function wt(t) {
  t.headers.has("user-agent") || t.headers.set("user-agent", "Next.js Middleware");
}
__name(wt, "wt");
var X = Symbol.for("next-on-pages fetch patch");
p();
u();
d();
var Y = q(Q());
var T = /* @__PURE__ */ __name(class {
  constructor(e, a, s, i, c) {
    this.routes = e;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), x(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = c?.find((n) => n.domain === this.url.hostname), this.locales = new Set(i.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(e, { checkStatus: a, checkIntercept: s }) {
    let i = j(e.src, this.path, e.caseSensitive);
    if (!i.match || e.methods && !e.methods.map((n) => n.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase()))
      return;
    let c = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: e.dest };
    if (!e.has?.find((n) => {
      let r = N(n, c);
      return r.newRouteDest && (c.routeDest = r.newRouteDest), !r.valid;
    }) && !e.missing?.find((n) => N(n, c).valid) && !(a && e.status !== this.status)) {
      if (s && e.dest) {
        let n = /\/(\(\.+\))+/, r = n.test(e.dest), o = n.test(this.path);
        if (r && !o)
          return;
      }
      return { routeMatch: i, routeDest: c.routeDest };
    }
  }
  processMiddlewareResp(e) {
    let a = "x-middleware-override-headers", s = e.headers.get(a);
    if (s) {
      let o = new Set(s.split(",").map((l) => l.trim()));
      for (let l of o.keys()) {
        let f = `x-middleware-request-${l}`, g = e.headers.get(f);
        this.reqCtx.request.headers.get(l) !== g && (g ? this.reqCtx.request.headers.set(l, g) : this.reqCtx.request.headers.delete(l)), e.headers.delete(f);
      }
      e.headers.delete(a);
    }
    let i = "x-middleware-rewrite", c = e.headers.get(i);
    if (c) {
      let o = new URL(c, this.url), l = this.url.hostname !== o.hostname;
      this.path = l ? `${o}` : o.pathname, x(this.searchParams, o.searchParams), e.headers.delete(i);
    }
    let n = "x-middleware-next";
    e.headers.get(n) ? e.headers.delete(n) : !c && !e.headers.has("location") ? (this.body = e.body, this.status = e.status) : e.headers.has("location") && e.status >= 300 && e.status < 400 && (this.status = e.status), m(this.reqCtx.request.headers, e.headers), m(this.headers.normal, e.headers), this.headers.middlewareLocation = e.headers.get("location");
  }
  async runRouteMiddleware(e) {
    if (!e)
      return true;
    let a = e && this.output[e];
    if (!a || a.type !== "middleware")
      return this.status = 500, false;
    let s = await S(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(e), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(e) {
    !e.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(e, a, s) {
    !e.headers || (m(this.headers.normal, e.headers, { match: a, captureGroupKeys: s }), e.important && m(this.headers.important, e.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(e) {
    !e.status || (this.status = e.status);
  }
  applyRouteDest(e, a, s) {
    if (!e.dest)
      return this.path;
    let i = this.path, c = e.dest;
    this.wildcardMatch && /\$wildcard/.test(c) && (c = c.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = v(c, a, s);
    let n = /\/index\.rsc$/i.test(this.path), r = /^\/(?:index)?$/i.test(i), o = /^\/__index\.prefetch\.rsc$/i.test(i);
    n && !r && !o && (this.path = i);
    let l = /\.rsc$/i.test(this.path), f = /\.prefetch\.rsc$/i.test(this.path), g = this.path in this.output;
    l && !f && !g && (this.path = this.path.replace(/\.rsc/i, ""));
    let w = new URL(this.path, this.url);
    return x(this.searchParams, w.searchParams), k(this.path) || (this.path = w.pathname), i;
  }
  applyLocaleRedirects(e) {
    if (!e.locale?.redirect || !/^\^(.)*$/.test(e.src) && e.src !== this.path || this.headers.normal.has("location"))
      return;
    let { locale: { redirect: s, cookie: i } } = e, c = i && this.cookies[i], n = L(c ?? ""), r = L(this.reqCtx.request.headers.get("accept-language") ?? ""), f = [...n, ...r].map((g) => s[g]).filter(Boolean)[0];
    if (f) {
      !this.path.startsWith(f) && (this.headers.normal.set("location", f), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(e, a) {
    return !this.locales || a !== "miss" ? e : G(e.src, this.locales) ? { ...e, src: e.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : e;
  }
  async checkRoute(e, a) {
    let s = this.getLocaleFriendlyRoute(a, e), { routeMatch: i, routeDest: c } = this.checkRouteMatch(s, { checkStatus: e === "error", checkIntercept: e === "rewrite" }) ?? {}, n = { ...s, dest: c };
    if (!i?.match || n.middlewarePath && this.middlewareInvoked.includes(n.middlewarePath))
      return "skip";
    let { match: r, captureGroupKeys: o } = i;
    if (this.applyRouteOverrides(n), this.applyLocaleRedirects(n), !await this.runRouteMiddleware(n.middlewarePath))
      return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation)
      return "done";
    this.applyRouteHeaders(n, r, o), this.applyRouteStatus(n);
    let f = this.applyRouteDest(n, r, o);
    if (n.check && !k(this.path))
      if (f === this.path) {
        if (e !== "miss")
          return this.checkPhase(O(e));
        this.status = 404;
      } else if (e === "miss") {
        if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output))
          return this.checkPhase("filesystem");
        this.status === 404 && (this.status = void 0);
      } else
        return this.checkPhase("none");
    return !n.continue || n.status && n.status >= 300 && n.status <= 399 ? "done" : "next";
  }
  async checkPhase(e) {
    if (this.checkPhaseCounter++ >= 50)
      return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let c of this.routes[e]) {
      let n = await this.checkRoute(e, c);
      if (n === "error")
        return "error";
      if (n === "done") {
        a = false;
        break;
      }
    }
    if (e === "hit" || k(this.path) || this.headers.normal.has("location") || !!this.body)
      return "done";
    if (e === "none")
      for (let c of this.locales) {
        let n = new RegExp(`/${c}(/.*)`), o = this.path.match(n)?.[1];
        if (o && o in this.output) {
          this.path = o;
          break;
        }
      }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let c = this.path.replace(/\/$/, "");
      s = c in this.output, s && (this.path = c);
    }
    if (e === "miss" && !s) {
      let c = !this.status || this.status < 400;
      this.status = c ? 404 : this.status;
    }
    let i = "miss";
    return s || e === "miss" || e === "error" ? i = "hit" : a && (i = O(e)), this.checkPhase(i);
  }
  async run(e = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(e);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
}, "T");
async function tt(t, e, a, s) {
  let i = new T(e.routes, a, t, s, e.wildcard), c = await et(i);
  return Et(t, c, a);
}
__name(tt, "tt");
async function et(t, e = "none", a = false) {
  return await t.run(e) === "error" || !a && t.status && t.status >= 400 ? et(t, "error", true) : { path: t.path, status: t.status, headers: t.headers, searchParams: t.searchParams, body: t.body };
}
__name(et, "et");
async function Et(t, { path: e = "/404", status: a, headers: s, searchParams: i, body: c }, n) {
  let r = s.normal.get("location");
  if (r) {
    if (r !== s.middlewareLocation) {
      let f = [...i.keys()].length ? `?${i.toString()}` : "";
      s.normal.set("location", `${r ?? "/"}${f}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let o;
  if (c !== void 0)
    o = new Response(c, { status: a });
  else if (k(e)) {
    let f = new URL(e);
    x(f.searchParams, i), o = await fetch(f, t.request);
  } else
    o = await S(n[e], t, { path: e, status: a, headers: s, searchParams: i });
  let l = s.normal;
  return m(l, o.headers), m(l, s.important), o = new Response(o.body, { ...o, status: a || o.status, headers: l }), o;
}
__name(Et, "Et");
p();
u();
d();
function st() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Tt };
}
__name(st, "st");
function Tt(t) {
  let e = globalThis.__nextOnPagesRoutesIsolation._map.get(t);
  if (e)
    return e;
  let a = Mt();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(t, a), a;
}
__name(Tt, "Tt");
function Mt() {
  let t = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: (e, a) => t.has(a) ? t.get(a) : Reflect.get(globalThis, a), set: (e, a, s) => It.has(a) ? Reflect.set(globalThis, a, s) : (t.set(a, s), true) });
}
__name(Mt, "Mt");
var It = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Nt = Object.defineProperty;
var At = /* @__PURE__ */ __name((...t) => {
  let e = t[0], a = t[1], s = "__import_unsupported";
  if (!(a === s && typeof e == "object" && e !== null && s in e))
    return Nt(...t);
}, "At");
globalThis.Object.defineProperty = At;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (e) {
      if (e instanceof Error && e.message.includes("Disallowed operation called within global scope"))
        return { signal: { aborted: false, reason: null, onabort: () => {
        }, throwIfAborted: () => {
        } }, abort() {
        } };
      throw e;
    }
  }
};
var Ps = { async fetch(t, e, a) {
  st(), Z();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let n = new URL(t.url), r = await e.ASSETS.fetch(`${n.protocol}//${n.host}/cdn-cgi/errors/no-nodejs_compat.html`), o = r.ok ? r.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(o, { status: 503 });
  }
  let { envAsyncLocalStorage: i, requestContextAsyncLocalStorage: c } = s;
  return i.run({ ...e, NODE_ENV: "production", SUSPENSE_CACHE_URL: R }, async () => c.run({ env: e, ctx: a, cf: t.cf }, async () => {
    if (new URL(t.url).pathname.startsWith("/_next/image"))
      return z(t, { buildOutput: _, assetsFetcher: e.ASSETS, imagesConfig: h.images });
    let r = B(t);
    return tt({ request: r, ctx: a, assetsFetcher: e.ASSETS }, h, _, y);
  }));
} };
export {
  Ps as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.8964605391796823.mjs.map
