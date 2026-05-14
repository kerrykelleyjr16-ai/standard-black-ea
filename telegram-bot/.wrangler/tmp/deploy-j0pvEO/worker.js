var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
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
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
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
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
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
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
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
var Performance = class {
  static {
    __name(this, "Performance");
  }
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
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
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
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance2)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2, key, desc);
      }
    }
  }
}
globalThis.performance = performance2;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
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
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
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

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
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
  cursorTo(x, y, callback) {
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
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
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
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
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
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
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
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
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
  // --- attached interfaces ---
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
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
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
  // internals
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
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
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/lib/telegram.ts
function clean(s) {
  let i = 0;
  while (i < s.length && s.charCodeAt(i) === 65279) i++;
  return s.slice(i).trim();
}
__name(clean, "clean");
async function getUpdates(token, offset) {
  const params = new URLSearchParams({ limit: "100", timeout: "0" });
  if (offset !== void 0) params.set("offset", String(offset));
  const res = await fetch(
    `https://api.telegram.org/bot${clean(token)}/getUpdates?${params}`
  );
  const data = await res.json();
  if (!data.ok)
    throw new Error(`Telegram getUpdates failed: ${data.description ?? "unknown"}`);
  return data.result;
}
__name(getUpdates, "getUpdates");
async function sendMessage(token, chatId, text) {
  const t = clean(token);
  const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
  const data = await res.json();
  if (!data.ok) {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
  }
}
__name(sendMessage, "sendMessage");
async function sendTyping(token, chatId) {
  await fetch(
    `https://api.telegram.org/bot${clean(token)}/sendChatAction`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" })
    }
  );
}
__name(sendTyping, "sendTyping");

// node_modules/@anthropic-ai/sdk/error.mjs
var error_exports = {};
__export(error_exports, {
  APIConnectionError: () => APIConnectionError,
  APIConnectionTimeoutError: () => APIConnectionTimeoutError,
  APIError: () => APIError,
  APIUserAbortError: () => APIUserAbortError,
  AnthropicError: () => AnthropicError,
  AuthenticationError: () => AuthenticationError,
  BadRequestError: () => BadRequestError,
  ConflictError: () => ConflictError,
  InternalServerError: () => InternalServerError,
  NotFoundError: () => NotFoundError,
  PermissionDeniedError: () => PermissionDeniedError,
  RateLimitError: () => RateLimitError,
  UnprocessableEntityError: () => UnprocessableEntityError
});

// node_modules/@anthropic-ai/sdk/version.mjs
var VERSION = "0.30.1";

// node_modules/@anthropic-ai/sdk/_shims/registry.mjs
var auto = false;
var kind = void 0;
var fetch2 = void 0;
var Request2 = void 0;
var Response2 = void 0;
var Headers2 = void 0;
var FormData2 = void 0;
var Blob2 = void 0;
var File2 = void 0;
var ReadableStream2 = void 0;
var getMultipartRequestOptions = void 0;
var getDefaultAgent = void 0;
var fileFromPath = void 0;
var isFsReadStream = void 0;
function setShims(shims, options = { auto: false }) {
  if (auto) {
    throw new Error(`you must \`import '@anthropic-ai/sdk/shims/${shims.kind}'\` before importing anything else from @anthropic-ai/sdk`);
  }
  if (kind) {
    throw new Error(`can't \`import '@anthropic-ai/sdk/shims/${shims.kind}'\` after \`import '@anthropic-ai/sdk/shims/${kind}'\``);
  }
  auto = options.auto;
  kind = shims.kind;
  fetch2 = shims.fetch;
  Request2 = shims.Request;
  Response2 = shims.Response;
  Headers2 = shims.Headers;
  FormData2 = shims.FormData;
  Blob2 = shims.Blob;
  File2 = shims.File;
  ReadableStream2 = shims.ReadableStream;
  getMultipartRequestOptions = shims.getMultipartRequestOptions;
  getDefaultAgent = shims.getDefaultAgent;
  fileFromPath = shims.fileFromPath;
  isFsReadStream = shims.isFsReadStream;
}
__name(setShims, "setShims");

// node_modules/@anthropic-ai/sdk/_shims/MultipartBody.mjs
var MultipartBody = class {
  static {
    __name(this, "MultipartBody");
  }
  constructor(body) {
    this.body = body;
  }
  get [Symbol.toStringTag]() {
    return "MultipartBody";
  }
};

// node_modules/@anthropic-ai/sdk/_shims/web-runtime.mjs
function getRuntime({ manuallyImported } = {}) {
  const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import \u2026 from '@anthropic-ai/sdk'\`:
- \`import '@anthropic-ai/sdk/shims/node'\` (if you're running on Node)
- \`import '@anthropic-ai/sdk/shims/web'\` (otherwise)
`;
  let _fetch, _Request, _Response, _Headers;
  try {
    _fetch = fetch;
    _Request = Request;
    _Response = Response;
    _Headers = Headers;
  } catch (error3) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${error3.message}. ${recommendation}`);
  }
  return {
    kind: "web",
    fetch: _fetch,
    Request: _Request,
    Response: _Response,
    Headers: _Headers,
    FormData: (
      // @ts-ignore
      typeof FormData !== "undefined" ? FormData : class FormData {
        static {
          __name(this, "FormData");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
        }
      }
    ),
    Blob: typeof Blob !== "undefined" ? Blob : class Blob {
      static {
        __name(this, "Blob");
      }
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File !== "undefined" ? File : class File {
        static {
          __name(this, "File");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
        static {
          __name(this, "ReadableStream");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
        }
      }
    ),
    getMultipartRequestOptions: /* @__PURE__ */ __name(async (form, opts) => ({
      ...opts,
      body: new MultipartBody(form)
    }), "getMultipartRequestOptions"),
    getDefaultAgent: /* @__PURE__ */ __name((url) => void 0, "getDefaultAgent"),
    fileFromPath: /* @__PURE__ */ __name(() => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/anthropics/anthropic-sdk-typescript#file-uploads");
    }, "fileFromPath"),
    isFsReadStream: /* @__PURE__ */ __name((value) => false, "isFsReadStream")
  };
}
__name(getRuntime, "getRuntime");

// node_modules/@anthropic-ai/sdk/_shims/index.mjs
if (!kind) setShims(getRuntime(), { auto: true });

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var LineDecoder = class _LineDecoder {
  static {
    __name(this, "LineDecoder");
  }
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = "\r" + text;
      this.trailingCR = false;
    }
    if (text.endsWith("\r")) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = _LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
    let lines = text.split(_LineDecoder.NEWLINE_REGEXP);
    if (trailingNewline) {
      lines.pop();
    }
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    if (bytes == null)
      return "";
    if (typeof bytes === "string")
      return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new AnthropicError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
        return this.textDecoder.decode(bytes);
      }
      throw new AnthropicError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new AnthropicError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;

// node_modules/@anthropic-ai/sdk/streaming.mjs
var Stream = class _Stream {
  static {
    __name(this, "Stream");
  }
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  static fromSSEResponse(response, controller) {
    let consumed = false;
    async function* iterator() {
      if (consumed) {
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (sse.event === "completion") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "ping") {
            continue;
          }
          if (sse.event === "error") {
            throw APIError.generate(void 0, `SSE Error: ${sse.data}`, sse.data, createResponseHeaders(response.headers));
          }
        }
        done = true;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError")
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
      }
    }
    __name(iterator, "iterator");
    return new _Stream(iterator, controller);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(readableStream, controller) {
    let consumed = false;
    async function* iterLines() {
      const lineDecoder = new LineDecoder();
      const iter = readableStreamAsyncIterable(readableStream);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }
      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }
    __name(iterLines, "iterLines");
    async function* iterator() {
      if (consumed) {
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done)
            continue;
          if (line)
            yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError")
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
      }
    }
    __name(iterator, "iterator");
    return new _Stream(iterator, controller);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const left = [];
    const right = [];
    const iterator = this.iterator();
    const teeIterator = /* @__PURE__ */ __name((queue) => {
      return {
        next: /* @__PURE__ */ __name(() => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift();
        }, "next")
      };
    }, "teeIterator");
    return [
      new _Stream(() => teeIterator(left), this.controller),
      new _Stream(() => teeIterator(right), this.controller)
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const self = this;
    let iter;
    const encoder = new TextEncoder();
    return new ReadableStream2({
      async start() {
        iter = self[Symbol.asyncIterator]();
      },
      async pull(ctrl) {
        try {
          const { value, done } = await iter.next();
          if (done)
            return ctrl.close();
          const bytes = encoder.encode(JSON.stringify(value) + "\n");
          ctrl.enqueue(bytes);
        } catch (err) {
          ctrl.error(err);
        }
      },
      async cancel() {
        await iter.return?.();
      }
    });
  }
};
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    controller.abort();
    throw new AnthropicError(`Attempted to iterate over a response with no body`);
  }
  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();
  const iter = readableStreamAsyncIterable(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
__name(_iterSSEMessages, "_iterSSEMessages");
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array();
  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }
    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }
  if (data.length > 0) {
    yield data;
  }
}
__name(iterSSEChunks, "iterSSEChunks");
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}
__name(findDoubleNewlineIndex, "findDoubleNewlineIndex");
var SSEDecoder = class {
  static {
    __name(this, "SSEDecoder");
  }
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length)
        return null;
      const sse = {
        event: this.event,
        data: this.data.join("\n"),
        raw: this.chunks
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldname === "event") {
      this.event = value;
    } else if (fieldname === "data") {
      this.data.push(value);
    }
    return null;
  }
};
function partition(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }
  return [str, "", ""];
}
__name(partition, "partition");
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(readableStreamAsyncIterable, "readableStreamAsyncIterable");

// node_modules/@anthropic-ai/sdk/uploads.mjs
var isResponseLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function", "isResponseLike");
var isFileLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value), "isFileLike");
var isBlobLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function", "isBlobLike");
async function toFile(value, name, options) {
  value = await value;
  if (isFileLike(value)) {
    return value;
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
    const data = isBlobLike(blob) ? [await blob.arrayBuffer()] : [blob];
    return new File2(data, name, options);
  }
  const bits = await getBytes(value);
  name || (name = getName(value) ?? "unknown_file");
  if (!options?.type) {
    const type = bits[0]?.type;
    if (typeof type === "string") {
      options = { ...options, type };
    }
  }
  return new File2(bits, name, options);
}
__name(toFile, "toFile");
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(await value.arrayBuffer());
  } else if (isAsyncIterableIterator(value)) {
    for await (const chunk of value) {
      parts.push(chunk);
    }
  } else {
    throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
  }
  return parts;
}
__name(getBytes, "getBytes");
function propsForError(value) {
  const props = Object.getOwnPropertyNames(value);
  return `[${props.map((p) => `"${p}"`).join(", ")}]`;
}
__name(propsForError, "propsForError");
function getName(value) {
  return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
  getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
}
__name(getName, "getName");
var getStringFromMaybeBuffer = /* @__PURE__ */ __name((x) => {
  if (typeof x === "string")
    return x;
  if (typeof Buffer !== "undefined" && x instanceof Buffer)
    return String(x);
  return void 0;
}, "getStringFromMaybeBuffer");
var isAsyncIterableIterator = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function", "isAsyncIterableIterator");
var isMultipartBody = /* @__PURE__ */ __name((body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody", "isMultipartBody");

// node_modules/@anthropic-ai/sdk/core.mjs
var __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbstractPage_client;
async function defaultParseResponse(props) {
  const { response } = props;
  if (props.options.stream) {
    debug3("response", response.status, response.url, response.headers, response.body);
    if (props.options.__streamClass) {
      return props.options.__streamClass.fromSSEResponse(response, props.controller);
    }
    return Stream.fromSSEResponse(response, props.controller);
  }
  if (response.status === 204) {
    return null;
  }
  if (props.options.__binaryResponse) {
    return response;
  }
  const contentType = response.headers.get("content-type");
  const isJSON = contentType?.includes("application/json") || contentType?.includes("application/vnd.api+json");
  if (isJSON) {
    const json = await response.json();
    debug3("response", response.status, response.url, response.headers, json);
    return json;
  }
  const text = await response.text();
  debug3("response", response.status, response.url, response.headers, text);
  return text;
}
__name(defaultParseResponse, "defaultParseResponse");
var APIPromise = class _APIPromise extends Promise {
  static {
    __name(this, "APIPromise");
  }
  constructor(responsePromise, parseResponse2 = defaultParseResponse) {
    super((resolve) => {
      resolve(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse2;
  }
  _thenUnwrap(transform2) {
    return new _APIPromise(this.responsePromise, async (props) => transform2(await this.parseResponse(props), props));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from '@anthropic-ai/sdk'`:
   * - `import '@anthropic-ai/sdk/shims/node'` (if you're running on Node)
   * - `import '@anthropic-ai/sdk/shims/web'` (otherwise)
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from '@anthropic-ai/sdk'`:
   * - `import '@anthropic-ai/sdk/shims/node'` (if you're running on Node)
   * - `import '@anthropic-ai/sdk/shims/web'` (otherwise)
   */
  async withResponse() {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response };
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then(this.parseResponse);
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
};
var APIClient = class {
  static {
    __name(this, "APIClient");
  }
  constructor({
    baseURL,
    maxRetries = 2,
    timeout = 6e5,
    // 10 minutes
    httpAgent,
    fetch: overridenFetch
  }) {
    this.baseURL = baseURL;
    this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
    this.timeout = validatePositiveInteger("timeout", timeout);
    this.httpAgent = httpAgent;
    this.fetch = overridenFetch ?? fetch2;
  }
  authHeaders(opts) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(opts) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.getUserAgent(),
      ...getPlatformHeaders(),
      ...this.authHeaders(opts)
    };
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(headers, customHeaders) {
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  get(path, opts) {
    return this.methodRequest("get", path, opts);
  }
  post(path, opts) {
    return this.methodRequest("post", path, opts);
  }
  patch(path, opts) {
    return this.methodRequest("patch", path, opts);
  }
  put(path, opts) {
    return this.methodRequest("put", path, opts);
  }
  delete(path, opts) {
    return this.methodRequest("delete", path, opts);
  }
  methodRequest(method, path, opts) {
    return this.request(Promise.resolve(opts).then(async (opts2) => {
      const body = opts2 && isBlobLike(opts2?.body) ? new DataView(await opts2.body.arrayBuffer()) : opts2?.body instanceof DataView ? opts2.body : opts2?.body instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2?.body) ? new DataView(opts2.body.buffer) : opts2?.body;
      return { method, path, ...opts2, body };
    }));
  }
  getAPIList(path, Page2, opts) {
    return this.requestAPIList(Page2, { method: "get", path, ...opts });
  }
  calculateContentLength(body) {
    if (typeof body === "string") {
      if (typeof Buffer !== "undefined") {
        return Buffer.byteLength(body, "utf8").toString();
      }
      if (typeof TextEncoder !== "undefined") {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(body);
        return encoded.length.toString();
      }
    } else if (ArrayBuffer.isView(body)) {
      return body.byteLength.toString();
    }
    return null;
  }
  buildRequest(options, { retryCount = 0 } = {}) {
    const { method, path, query, headers = {} } = options;
    const body = ArrayBuffer.isView(options.body) || options.__binaryRequest && typeof options.body === "string" ? options.body : isMultipartBody(options.body) ? options.body.body : options.body ? JSON.stringify(options.body, null, 2) : null;
    const contentLength = this.calculateContentLength(body);
    const url = this.buildURL(path, query);
    if ("timeout" in options)
      validatePositiveInteger("timeout", options.timeout);
    const timeout = options.timeout ?? this.timeout;
    const httpAgent = options.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
    const minAgentTimeout = timeout + 1e3;
    if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
      httpAgent.options.timeout = minAgentTimeout;
    }
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey)
        options.idempotencyKey = this.defaultIdempotencyKey();
      headers[this.idempotencyHeader] = options.idempotencyKey;
    }
    const reqHeaders = this.buildHeaders({ options, headers, contentLength, retryCount });
    const req = {
      method,
      ...body && { body },
      headers: reqHeaders,
      ...httpAgent && { agent: httpAgent },
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: options.signal ?? null
    };
    return { req, url, timeout };
  }
  buildHeaders({ options, headers, contentLength, retryCount }) {
    const reqHeaders = {};
    if (contentLength) {
      reqHeaders["content-length"] = contentLength;
    }
    const defaultHeaders = this.defaultHeaders(options);
    applyHeadersMut(reqHeaders, defaultHeaders);
    applyHeadersMut(reqHeaders, headers);
    if (isMultipartBody(options.body) && kind !== "node") {
      delete reqHeaders["content-type"];
    }
    if (getHeader(defaultHeaders, "x-stainless-retry-count") === void 0 && getHeader(headers, "x-stainless-retry-count") === void 0) {
      reqHeaders["x-stainless-retry-count"] = String(retryCount);
    }
    this.validateHeaders(reqHeaders, headers);
    return reqHeaders;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(options) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(request, { url, options }) {
  }
  parseHeaders(headers) {
    return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
  }
  makeStatusError(status, error3, message, headers) {
    return APIError.generate(status, error3, message, headers);
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this.makeRequest(options, remainingRetries));
  }
  async makeRequest(optionsInput, retriesRemaining) {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }
    await this.prepareOptions(options);
    const { req, url, timeout } = this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
    await this.prepareRequest(req, { url, options });
    debug3("request", url, options, req.headers);
    if (options.signal?.aborted) {
      throw new APIUserAbortError();
    }
    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
    if (response instanceof Error) {
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      if (retriesRemaining) {
        return this.retryRequest(options, retriesRemaining);
      }
      if (response.name === "AbortError") {
        throw new APIConnectionTimeoutError();
      }
      throw new APIConnectionError({ cause: response });
    }
    const responseHeaders = createResponseHeaders(response.headers);
    if (!response.ok) {
      if (retriesRemaining && this.shouldRetry(response)) {
        const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
        debug3(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
        return this.retryRequest(options, retriesRemaining, responseHeaders);
      }
      const errText = await response.text().catch((e) => castToError(e).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? void 0 : errText;
      const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
      debug3(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
      const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
      throw err;
    }
    return { response, options, controller };
  }
  requestAPIList(Page2, options) {
    const request = this.makeRequest(options, null);
    return new PagePromise(this, request, Page2);
  }
  buildURL(path, query) {
    const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = { ...defaultQuery, ...query };
    }
    if (typeof query === "object" && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  stringifyQuery(query) {
    return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      if (value === null) {
        return `${encodeURIComponent(key)}=`;
      }
      throw new AnthropicError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  async fetchWithTimeout(url, init, ms, controller) {
    const { signal, ...options } = init || {};
    if (signal)
      signal.addEventListener("abort", () => controller.abort());
    const timeout = setTimeout(() => controller.abort(), ms);
    return this.getRequestClient().fetch.call(void 0, url, { signal: controller.signal, ...options }).finally(() => {
      clearTimeout(timeout);
    });
  }
  getRequestClient() {
    return { fetch: this.fetch };
  }
  shouldRetry(response) {
    const shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true")
      return true;
    if (shouldRetryHeader === "false")
      return false;
    if (response.status === 408)
      return true;
    if (response.status === 409)
      return true;
    if (response.status === 429)
      return true;
    if (response.status >= 500)
      return true;
    return false;
  }
  async retryRequest(options, retriesRemaining, responseHeaders) {
    let timeoutMillis;
    const retryAfterMillisHeader = responseHeaders?.["retry-after-ms"];
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }
    const retryAfterHeader = responseHeaders?.["retry-after"];
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1e3;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }
    if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);
    return this.makeRequest(options, retriesRemaining - 1);
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8;
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
    const jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1e3;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${VERSION}`;
  }
};
var AbstractPage = class {
  static {
    __name(this, "AbstractPage");
  }
  constructor(client, response, body, options) {
    _AbstractPage_client.set(this, void 0);
    __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
    this.options = options;
    this.response = response;
    this.body = body;
  }
  hasNextPage() {
    const items = this.getPaginatedItems();
    if (!items.length)
      return false;
    return this.nextPageInfo() != null;
  }
  async getNextPage() {
    const nextInfo = this.nextPageInfo();
    if (!nextInfo) {
      throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    }
    const nextOptions = { ...this.options };
    if ("params" in nextInfo && typeof nextOptions.query === "object") {
      nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
    } else if ("url" in nextInfo) {
      const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
      for (const [key, value] of params) {
        nextInfo.url.searchParams.set(key, value);
      }
      nextOptions.query = void 0;
      nextOptions.path = nextInfo.url.toString();
    }
    return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
  }
  async *iterPages() {
    let page = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }
  async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
};
var PagePromise = class extends APIPromise {
  static {
    __name(this, "PagePromise");
  }
  constructor(client, request, Page2) {
    super(request, async (props) => new Page2(client, props.response, await defaultParseResponse(props), props.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
};
var createResponseHeaders = /* @__PURE__ */ __name((headers) => {
  return new Proxy(Object.fromEntries(
    // @ts-ignore
    headers.entries()
  ), {
    get(target, name) {
      const key = name.toString();
      return target[key.toLowerCase()] || target[key];
    }
  });
}, "createResponseHeaders");
var requestOptionsKeys = {
  method: true,
  path: true,
  query: true,
  body: true,
  headers: true,
  maxRetries: true,
  stream: true,
  timeout: true,
  httpAgent: true,
  signal: true,
  idempotencyKey: true,
  __binaryRequest: true,
  __binaryResponse: true,
  __streamClass: true
};
var isRequestOptions = /* @__PURE__ */ __name((obj) => {
  return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
}, "isRequestOptions");
var getPlatformProperties = /* @__PURE__ */ __name(() => {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(Deno.build.os),
      "X-Stainless-Arch": normalizeArch(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": process.version
    };
  }
  if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(process.platform),
      "X-Stainless-Arch": normalizeArch(process.arch),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": process.version
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
      "X-Stainless-Runtime-Version": browserInfo.version
    };
  }
  return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": VERSION,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec("Cloudflare-Workers");
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
__name(getBrowserInfo, "getBrowserInfo");
var normalizeArch = /* @__PURE__ */ __name((arch2) => {
  if (arch2 === "x32")
    return "x32";
  if (arch2 === "x86_64" || arch2 === "x64")
    return "x64";
  if (arch2 === "arm")
    return "arm";
  if (arch2 === "aarch64" || arch2 === "arm64")
    return "arm64";
  if (arch2)
    return `other:${arch2}`;
  return "unknown";
}, "normalizeArch");
var normalizePlatform = /* @__PURE__ */ __name((platform2) => {
  platform2 = platform2.toLowerCase();
  if (platform2.includes("ios"))
    return "iOS";
  if (platform2 === "android")
    return "Android";
  if (platform2 === "darwin")
    return "MacOS";
  if (platform2 === "win32")
    return "Windows";
  if (platform2 === "freebsd")
    return "FreeBSD";
  if (platform2 === "openbsd")
    return "OpenBSD";
  if (platform2 === "linux")
    return "Linux";
  if (platform2)
    return `Other:${platform2}`;
  return "Unknown";
}, "normalizePlatform");
var _platformHeaders;
var getPlatformHeaders = /* @__PURE__ */ __name(() => {
  return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
}, "getPlatformHeaders");
var safeJSON = /* @__PURE__ */ __name((text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return void 0;
  }
}, "safeJSON");
var startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
var isAbsoluteURL = /* @__PURE__ */ __name((url) => {
  return startsWithSchemeRegexp.test(url);
}, "isAbsoluteURL");
var sleep = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");
var validatePositiveInteger = /* @__PURE__ */ __name((name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new AnthropicError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new AnthropicError(`${name} must be a positive integer`);
  }
  return n;
}, "validatePositiveInteger");
var castToError = /* @__PURE__ */ __name((err) => {
  if (err instanceof Error)
    return err;
  if (typeof err === "object" && err !== null) {
    try {
      return new Error(JSON.stringify(err));
    } catch {
    }
  }
  return new Error(String(err));
}, "castToError");
var readEnv = /* @__PURE__ */ __name((env2) => {
  if (typeof process !== "undefined") {
    return process.env?.[env2]?.trim() ?? void 0;
  }
  if (typeof Deno !== "undefined") {
    return Deno.env?.get?.(env2)?.trim();
  }
  return void 0;
}, "readEnv");
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
__name(isEmptyObj, "isEmptyObj");
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
__name(hasOwn, "hasOwn");
function applyHeadersMut(targetHeaders, newHeaders) {
  for (const k in newHeaders) {
    if (!hasOwn(newHeaders, k))
      continue;
    const lowerKey = k.toLowerCase();
    if (!lowerKey)
      continue;
    const val = newHeaders[k];
    if (val === null) {
      delete targetHeaders[lowerKey];
    } else if (val !== void 0) {
      targetHeaders[lowerKey] = val;
    }
  }
}
__name(applyHeadersMut, "applyHeadersMut");
function debug3(action, ...args) {
  if (typeof process !== "undefined" && process?.env?.["DEBUG"] === "true") {
    console.log(`Anthropic:DEBUG:${action}`, ...args);
  }
}
__name(debug3, "debug");
var uuid4 = /* @__PURE__ */ __name(() => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}, "uuid4");
var isRunningInBrowser = /* @__PURE__ */ __name(() => {
  return (
    // @ts-ignore
    typeof window !== "undefined" && // @ts-ignore
    typeof window.document !== "undefined" && // @ts-ignore
    typeof navigator !== "undefined"
  );
}, "isRunningInBrowser");
var isHeadersProtocol = /* @__PURE__ */ __name((headers) => {
  return typeof headers?.get === "function";
}, "isHeadersProtocol");
var getHeader = /* @__PURE__ */ __name((headers, header) => {
  const lowerCasedHeader = header.toLowerCase();
  if (isHeadersProtocol(headers)) {
    const intercapsHeader = header[0]?.toUpperCase() + header.substring(1).replace(/([^\w])(\w)/g, (_m, g1, g2) => g1 + g2.toUpperCase());
    for (const key of [header, lowerCasedHeader, header.toUpperCase(), intercapsHeader]) {
      const value = headers.get(key);
      if (value) {
        return value;
      }
    }
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerCasedHeader) {
      if (Array.isArray(value)) {
        if (value.length <= 1)
          return value[0];
        console.warn(`Received ${value.length} entries for the ${header} header, using the first entry.`);
        return value[0];
      }
      return value;
    }
  }
  return void 0;
}, "getHeader");

// node_modules/@anthropic-ai/sdk/error.mjs
var AnthropicError = class extends Error {
  static {
    __name(this, "AnthropicError");
  }
};
var APIError = class _APIError extends AnthropicError {
  static {
    __name(this, "APIError");
  }
  constructor(status, error3, message, headers) {
    super(`${_APIError.makeMessage(status, error3, message)}`);
    this.status = status;
    this.headers = headers;
    this.request_id = headers?.["request-id"];
    this.error = error3;
  }
  static makeMessage(status, error3, message) {
    const msg = error3?.message ? typeof error3.message === "string" ? error3.message : JSON.stringify(error3.message) : error3 ? JSON.stringify(error3) : message;
    if (status && msg) {
      return `${status} ${msg}`;
    }
    if (status) {
      return `${status} status code (no body)`;
    }
    if (msg) {
      return msg;
    }
    return "(no status code or body)";
  }
  static generate(status, errorResponse, message, headers) {
    if (!status) {
      return new APIConnectionError({ message, cause: castToError(errorResponse) });
    }
    const error3 = errorResponse;
    if (status === 400) {
      return new BadRequestError(status, error3, message, headers);
    }
    if (status === 401) {
      return new AuthenticationError(status, error3, message, headers);
    }
    if (status === 403) {
      return new PermissionDeniedError(status, error3, message, headers);
    }
    if (status === 404) {
      return new NotFoundError(status, error3, message, headers);
    }
    if (status === 409) {
      return new ConflictError(status, error3, message, headers);
    }
    if (status === 422) {
      return new UnprocessableEntityError(status, error3, message, headers);
    }
    if (status === 429) {
      return new RateLimitError(status, error3, message, headers);
    }
    if (status >= 500) {
      return new InternalServerError(status, error3, message, headers);
    }
    return new _APIError(status, error3, message, headers);
  }
};
var APIUserAbortError = class extends APIError {
  static {
    __name(this, "APIUserAbortError");
  }
  constructor({ message } = {}) {
    super(void 0, void 0, message || "Request was aborted.", void 0);
    this.status = void 0;
  }
};
var APIConnectionError = class extends APIError {
  static {
    __name(this, "APIConnectionError");
  }
  constructor({ message, cause }) {
    super(void 0, void 0, message || "Connection error.", void 0);
    this.status = void 0;
    if (cause)
      this.cause = cause;
  }
};
var APIConnectionTimeoutError = class extends APIConnectionError {
  static {
    __name(this, "APIConnectionTimeoutError");
  }
  constructor({ message } = {}) {
    super({ message: message ?? "Request timed out." });
  }
};
var BadRequestError = class extends APIError {
  static {
    __name(this, "BadRequestError");
  }
  constructor() {
    super(...arguments);
    this.status = 400;
  }
};
var AuthenticationError = class extends APIError {
  static {
    __name(this, "AuthenticationError");
  }
  constructor() {
    super(...arguments);
    this.status = 401;
  }
};
var PermissionDeniedError = class extends APIError {
  static {
    __name(this, "PermissionDeniedError");
  }
  constructor() {
    super(...arguments);
    this.status = 403;
  }
};
var NotFoundError = class extends APIError {
  static {
    __name(this, "NotFoundError");
  }
  constructor() {
    super(...arguments);
    this.status = 404;
  }
};
var ConflictError = class extends APIError {
  static {
    __name(this, "ConflictError");
  }
  constructor() {
    super(...arguments);
    this.status = 409;
  }
};
var UnprocessableEntityError = class extends APIError {
  static {
    __name(this, "UnprocessableEntityError");
  }
  constructor() {
    super(...arguments);
    this.status = 422;
  }
};
var RateLimitError = class extends APIError {
  static {
    __name(this, "RateLimitError");
  }
  constructor() {
    super(...arguments);
    this.status = 429;
  }
};
var InternalServerError = class extends APIError {
  static {
    __name(this, "InternalServerError");
  }
};

// node_modules/@anthropic-ai/sdk/pagination.mjs
var Page = class extends AbstractPage {
  static {
    __name(this, "Page");
  }
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.has_more = body.has_more || false;
    this.first_id = body.first_id || null;
    this.last_id = body.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    const info3 = this.nextPageInfo();
    if (!info3)
      return null;
    if ("params" in info3)
      return info3.params;
    const params = Object.fromEntries(info3.url.searchParams);
    if (!Object.keys(params).length)
      return null;
    return params;
  }
  nextPageInfo() {
    if (this.options.query?.["before_id"]) {
      const firstId = this.first_id;
      if (!firstId) {
        return null;
      }
      return {
        params: {
          before_id: firstId
        }
      };
    }
    const cursor = this.last_id;
    if (!cursor) {
      return null;
    }
    return {
      params: {
        after_id: cursor
      }
    };
  }
};

// node_modules/@anthropic-ai/sdk/resource.mjs
var APIResource = class {
  static {
    __name(this, "APIResource");
  }
  constructor(client) {
    this._client = client;
  }
};

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var JSONLDecoder = class _JSONLDecoder {
  static {
    __name(this, "JSONLDecoder");
  }
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  async *decoder() {
    const lineDecoder = new LineDecoder();
    for await (const chunk of this.iterator) {
      for (const line of lineDecoder.decode(chunk)) {
        yield JSON.parse(line);
      }
    }
    for (const line of lineDecoder.flush()) {
      yield JSON.parse(line);
    }
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(response, controller) {
    if (!response.body) {
      controller.abort();
      throw new AnthropicError(`Attempted to iterate over a response with no body`);
    }
    return new _JSONLDecoder(readableStreamAsyncIterable(response.body), controller);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches = class extends APIResource {
  static {
    __name(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/messages/batches?beta=true", {
      body,
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
        ...options?.headers
      }
    });
  }
  retrieve(messageBatchId, params = {}, options) {
    if (isRequestOptions(params)) {
      return this.retrieve(messageBatchId, {}, params);
    }
    const { betas } = params;
    return this._client.get(`/v1/messages/batches/${messageBatchId}?beta=true`, {
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
        ...options?.headers
      }
    });
  }
  list(params = {}, options) {
    if (isRequestOptions(params)) {
      return this.list({}, params);
    }
    const { betas, ...query } = params;
    return this._client.getAPIList("/v1/messages/batches?beta=true", BetaMessageBatchesPage, {
      query,
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
        ...options?.headers
      }
    });
  }
  cancel(messageBatchId, params = {}, options) {
    if (isRequestOptions(params)) {
      return this.cancel(messageBatchId, {}, params);
    }
    const { betas } = params;
    return this._client.post(`/v1/messages/batches/${messageBatchId}/cancel?beta=true`, {
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
        ...options?.headers
      }
    });
  }
  async results(messageBatchId, params = {}, options) {
    if (isRequestOptions(params)) {
      return this.results(messageBatchId, {}, params);
    }
    const batch = await this.retrieve(messageBatchId);
    if (!batch.results_url) {
      throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
    }
    const { betas } = params;
    return this._client.get(batch.results_url, {
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
        ...options?.headers
      },
      __binaryResponse: true
    })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
  }
};
var BetaMessageBatchesPage = class extends Page {
  static {
    __name(this, "BetaMessageBatchesPage");
  }
};
(function(Batches2) {
  Batches2.BetaMessageBatchesPage = BetaMessageBatchesPage;
})(Batches || (Batches = {}));

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var Messages = class extends APIResource {
  static {
    __name(this, "Messages");
  }
  constructor() {
    super(...arguments);
    this.batches = new Batches(this._client);
  }
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/messages?beta=true", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      headers: {
        ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0,
        ...options?.headers
      },
      stream: params.stream ?? false
    });
  }
};
(function(Messages4) {
  Messages4.Batches = Batches;
  Messages4.BetaMessageBatchesPage = BetaMessageBatchesPage;
})(Messages || (Messages = {}));

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var tokenize = /* @__PURE__ */ __name((input) => {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === "\\") {
      current++;
      continue;
    }
    if (char === "{") {
      tokens.push({
        type: "brace",
        value: "{"
      });
      current++;
      continue;
    }
    if (char === "}") {
      tokens.push({
        type: "brace",
        value: "}"
      });
      current++;
      continue;
    }
    if (char === "[") {
      tokens.push({
        type: "paren",
        value: "["
      });
      current++;
      continue;
    }
    if (char === "]") {
      tokens.push({
        type: "paren",
        value: "]"
      });
      current++;
      continue;
    }
    if (char === ":") {
      tokens.push({
        type: "separator",
        value: ":"
      });
      current++;
      continue;
    }
    if (char === ",") {
      tokens.push({
        type: "delimiter",
        value: ","
      });
      current++;
      continue;
    }
    if (char === '"') {
      let value = "";
      let danglingQuote = false;
      char = input[++current];
      while (char !== '"') {
        if (current === input.length) {
          danglingQuote = true;
          break;
        }
        if (char === "\\") {
          current++;
          if (current === input.length) {
            danglingQuote = true;
            break;
          }
          value += char + input[current];
          char = input[++current];
        } else {
          value += char;
          char = input[++current];
        }
      }
      char = input[++current];
      if (!danglingQuote) {
        tokens.push({
          type: "string",
          value
        });
      }
      continue;
    }
    let WHITESPACE = /\s/;
    if (char && WHITESPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (char && NUMBERS.test(char) || char === "-" || char === ".") {
      let value = "";
      if (char === "-") {
        value += char;
        char = input[++current];
      }
      while (char && NUMBERS.test(char) || char === ".") {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: "number",
        value
      });
      continue;
    }
    let LETTERS = /[a-z]/i;
    if (char && LETTERS.test(char)) {
      let value = "";
      while (char && LETTERS.test(char)) {
        if (current === input.length) {
          break;
        }
        value += char;
        char = input[++current];
      }
      if (value == "true" || value == "false" || value === "null") {
        tokens.push({
          type: "name",
          value
        });
      } else {
        current++;
        continue;
      }
      continue;
    }
    current++;
  }
  return tokens;
}, "tokenize");
var strip = /* @__PURE__ */ __name((tokens) => {
  if (tokens.length === 0) {
    return tokens;
  }
  let lastToken = tokens[tokens.length - 1];
  switch (lastToken.type) {
    case "separator":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
    case "number":
      let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
      if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
    case "string":
      let tokenBeforeTheLastToken = tokens[tokens.length - 2];
      if (tokenBeforeTheLastToken?.type === "delimiter") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      } else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
      break;
    case "delimiter":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
  }
  return tokens;
}, "strip");
var unstrip = /* @__PURE__ */ __name((tokens) => {
  let tail = [];
  tokens.map((token) => {
    if (token.type === "brace") {
      if (token.value === "{") {
        tail.push("}");
      } else {
        tail.splice(tail.lastIndexOf("}"), 1);
      }
    }
    if (token.type === "paren") {
      if (token.value === "[") {
        tail.push("]");
      } else {
        tail.splice(tail.lastIndexOf("]"), 1);
      }
    }
  });
  if (tail.length > 0) {
    tail.reverse().map((item) => {
      if (item === "}") {
        tokens.push({
          type: "brace",
          value: "}"
        });
      } else if (item === "]") {
        tokens.push({
          type: "paren",
          value: "]"
        });
      }
    });
  }
  return tokens;
}, "unstrip");
var generate = /* @__PURE__ */ __name((tokens) => {
  let output = "";
  tokens.map((token) => {
    switch (token.type) {
      case "string":
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  });
  return output;
}, "generate");
var partialParse = /* @__PURE__ */ __name((input) => JSON.parse(generate(unstrip(strip(tokenize(input))))), "partialParse");

// node_modules/@anthropic-ai/sdk/lib/PromptCachingBetaMessageStream.mjs
var __classPrivateFieldSet2 = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PromptCachingBetaMessageStream_instances;
var _PromptCachingBetaMessageStream_currentMessageSnapshot;
var _PromptCachingBetaMessageStream_connectedPromise;
var _PromptCachingBetaMessageStream_resolveConnectedPromise;
var _PromptCachingBetaMessageStream_rejectConnectedPromise;
var _PromptCachingBetaMessageStream_endPromise;
var _PromptCachingBetaMessageStream_resolveEndPromise;
var _PromptCachingBetaMessageStream_rejectEndPromise;
var _PromptCachingBetaMessageStream_listeners;
var _PromptCachingBetaMessageStream_ended;
var _PromptCachingBetaMessageStream_errored;
var _PromptCachingBetaMessageStream_aborted;
var _PromptCachingBetaMessageStream_catchingPromiseCreated;
var _PromptCachingBetaMessageStream_getFinalMessage;
var _PromptCachingBetaMessageStream_getFinalText;
var _PromptCachingBetaMessageStream_handleError;
var _PromptCachingBetaMessageStream_beginRequest;
var _PromptCachingBetaMessageStream_addStreamEvent;
var _PromptCachingBetaMessageStream_endRequest;
var _PromptCachingBetaMessageStream_accumulateMessage;
var JSON_BUF_PROPERTY = "__json_buf";
var PromptCachingBetaMessageStream = class _PromptCachingBetaMessageStream {
  static {
    __name(this, "PromptCachingBetaMessageStream");
  }
  constructor() {
    _PromptCachingBetaMessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _PromptCachingBetaMessageStream_currentMessageSnapshot.set(this, void 0);
    this.controller = new AbortController();
    _PromptCachingBetaMessageStream_connectedPromise.set(this, void 0);
    _PromptCachingBetaMessageStream_resolveConnectedPromise.set(this, () => {
    });
    _PromptCachingBetaMessageStream_rejectConnectedPromise.set(this, () => {
    });
    _PromptCachingBetaMessageStream_endPromise.set(this, void 0);
    _PromptCachingBetaMessageStream_resolveEndPromise.set(this, () => {
    });
    _PromptCachingBetaMessageStream_rejectEndPromise.set(this, () => {
    });
    _PromptCachingBetaMessageStream_listeners.set(this, {});
    _PromptCachingBetaMessageStream_ended.set(this, false);
    _PromptCachingBetaMessageStream_errored.set(this, false);
    _PromptCachingBetaMessageStream_aborted.set(this, false);
    _PromptCachingBetaMessageStream_catchingPromiseCreated.set(this, false);
    _PromptCachingBetaMessageStream_handleError.set(this, (error3) => {
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_errored, true, "f");
      if (error3 instanceof Error && error3.name === "AbortError") {
        error3 = new APIUserAbortError();
      }
      if (error3 instanceof APIUserAbortError) {
        __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_aborted, true, "f");
        return this._emit("abort", error3);
      }
      if (error3 instanceof AnthropicError) {
        return this._emit("error", error3);
      }
      if (error3 instanceof Error) {
        const anthropicError = new AnthropicError(error3.message);
        anthropicError.cause = error3;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error3)));
    });
    __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_connectedPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_resolveConnectedPromise, resolve, "f");
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_endPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_resolveEndPromise, resolve, "f");
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_endPromise, "f").catch(() => {
    });
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream) {
    const runner = new _PromptCachingBetaMessageStream();
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  static createMessage(messages, params, options) {
    const runner = new _PromptCachingBetaMessageStream();
    for (const message of params.messages) {
      runner._addPromptCachingBetaMessageParam(message);
    }
    runner._run(() => runner._createPromptCachingBetaMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_handleError, "f"));
  }
  _addPromptCachingBetaMessageParam(message) {
    this.messages.push(message);
  }
  _addPromptCachingBetaMessage(message, emit2 = true) {
    this.receivedMessages.push(message);
    if (emit2) {
      this._emit("message", message);
    }
  }
  async _createPromptCachingBetaMessage(messages, params, options) {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      signal.addEventListener("abort", () => this.controller.abort());
    }
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_beginRequest).call(this);
    const stream = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal });
    this._connected();
    for await (const event of stream) {
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_addStreamEvent).call(this, event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_endRequest).call(this);
  }
  _connected() {
    if (this.ended)
      return;
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_resolveConnectedPromise, "f").call(this);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this PromptCachingBetaMessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners2 = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event] = []);
    listeners2.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this PromptCachingBetaMessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners2 = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event];
    if (!listeners2)
      return this;
    const index = listeners2.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners2.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this PromptCachingBetaMessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners2 = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event] = []);
    listeners2.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve);
    });
  }
  async done() {
    __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant PromptCachingBetaMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a PromptCachingBetaMessage.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant PromptCachingBetaMessage's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a PromptCachingBetaMessage.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_ended, true, "f");
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners2 = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event];
    if (listeners2) {
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_listeners, "f")[event] = listeners2.filter((l) => !l.once);
      listeners2.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error3 = args[0];
      if (!__classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_catchingPromiseCreated, "f") && !listeners2?.length) {
        Promise.reject(error3);
      }
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_rejectConnectedPromise, "f").call(this, error3);
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_rejectEndPromise, "f").call(this, error3);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error3 = args[0];
      if (!__classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_catchingPromiseCreated, "f") && !listeners2?.length) {
        Promise.reject(error3);
      }
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_rejectConnectedPromise, "f").call(this, error3);
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_rejectEndPromise, "f").call(this, error3);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalPromptCachingBetaMessage = this.receivedMessages.at(-1);
    if (finalPromptCachingBetaMessage) {
      this._emit("finalPromptCachingBetaMessage", __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      signal.addEventListener("abort", () => this.controller.abort());
    }
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_beginRequest).call(this);
    this._connected();
    const stream = Stream.fromReadableStream(readableStream, this.controller);
    for await (const event of stream) {
      __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_addStreamEvent).call(this, event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_endRequest).call(this);
  }
  [(_PromptCachingBetaMessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_listeners = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_ended = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_errored = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_aborted = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_handleError = /* @__PURE__ */ new WeakMap(), _PromptCachingBetaMessageStream_instances = /* @__PURE__ */ new WeakSet(), _PromptCachingBetaMessageStream_getFinalMessage = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a PromptCachingBetaMessage with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, "_PromptCachingBetaMessageStream_getFinalMessage"), _PromptCachingBetaMessageStream_getFinalText = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a PromptCachingBetaMessage with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, "_PromptCachingBetaMessageStream_getFinalText"), _PromptCachingBetaMessageStream_beginRequest = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, void 0, "f");
  }, "_PromptCachingBetaMessageStream_beginRequest"), _PromptCachingBetaMessageStream_addStreamEvent = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_instances, "m", _PromptCachingBetaMessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        if (event.delta.type === "text_delta" && content.type === "text") {
          this._emit("text", event.delta.text, content.text || "");
        } else if (event.delta.type === "input_json_delta" && content.type === "tool_use") {
          if (content.input) {
            this._emit("inputJson", event.delta.partial_json, content.input);
          }
        }
        break;
      }
      case "message_stop": {
        this._addPromptCachingBetaMessageParam(messageSnapshot);
        this._addPromptCachingBetaMessage(messageSnapshot, true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_PromptCachingBetaMessageStream_addStreamEvent"), _PromptCachingBetaMessageStream_endRequest = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, void 0, "f");
    return snapshot;
  }, "_PromptCachingBetaMessageStream_endRequest"), _PromptCachingBetaMessageStream_accumulateMessage = /* @__PURE__ */ __name(function _PromptCachingBetaMessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet2(this, _PromptCachingBetaMessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        snapshot.usage.output_tokens = event.usage.output_tokens;
        return snapshot;
      case "content_block_start":
        snapshot.content.push(event.content_block);
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        if (snapshotContent?.type === "text" && event.delta.type === "text_delta") {
          snapshotContent.text += event.delta.text;
        } else if (snapshotContent?.type === "tool_use" && event.delta.type === "input_json_delta") {
          let jsonBuf = snapshotContent[JSON_BUF_PROPERTY] || "";
          jsonBuf += event.delta.partial_json;
          Object.defineProperty(snapshotContent, JSON_BUF_PROPERTY, {
            value: jsonBuf,
            enumerable: false,
            writable: true
          });
          if (jsonBuf) {
            snapshotContent.input = partialParse(jsonBuf);
          }
        }
        return snapshot;
      }
      case "content_block_stop":
        return snapshot;
    }
  }, "_PromptCachingBetaMessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: /* @__PURE__ */ __name(async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
        }
        const chunk = pushQueue.shift();
        return { value: chunk, done: false };
      }, "next"),
      return: /* @__PURE__ */ __name(async () => {
        this.abort();
        return { value: void 0, done: true };
      }, "return")
    };
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/prompt-caching/messages.mjs
var Messages2 = class extends APIResource {
  static {
    __name(this, "Messages");
  }
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/messages?beta=prompt_caching", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      headers: {
        "anthropic-beta": [...betas ?? [], "prompt-caching-2024-07-31"].toString(),
        ...options?.headers
      },
      stream: params.stream ?? false
    });
  }
  /**
   * Create a Message stream
   */
  stream(body, options) {
    return PromptCachingBetaMessageStream.createMessage(this, body, options);
  }
};
/* @__PURE__ */ (function(Messages4) {
})(Messages2 || (Messages2 = {}));

// node_modules/@anthropic-ai/sdk/resources/beta/prompt-caching/prompt-caching.mjs
var PromptCaching = class extends APIResource {
  static {
    __name(this, "PromptCaching");
  }
  constructor() {
    super(...arguments);
    this.messages = new Messages2(this._client);
  }
};
(function(PromptCaching2) {
  PromptCaching2.Messages = Messages2;
})(PromptCaching || (PromptCaching = {}));

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta = class extends APIResource {
  static {
    __name(this, "Beta");
  }
  constructor() {
    super(...arguments);
    this.messages = new Messages(this._client);
    this.promptCaching = new PromptCaching(this._client);
  }
};
(function(Beta2) {
  Beta2.Messages = Messages;
  Beta2.PromptCaching = PromptCaching;
})(Beta || (Beta = {}));

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Completions = class extends APIResource {
  static {
    __name(this, "Completions");
  }
  create(body, options) {
    return this._client.post("/v1/complete", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      stream: body.stream ?? false
    });
  }
};
/* @__PURE__ */ (function(Completions2) {
})(Completions || (Completions = {}));

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var __classPrivateFieldSet3 = function(receiver, state, value, kind2, f) {
  if (kind2 === "m") throw new TypeError("Private method is not writable");
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet3 = function(receiver, state, kind2, f) {
  if (kind2 === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MessageStream_instances;
var _MessageStream_currentMessageSnapshot;
var _MessageStream_connectedPromise;
var _MessageStream_resolveConnectedPromise;
var _MessageStream_rejectConnectedPromise;
var _MessageStream_endPromise;
var _MessageStream_resolveEndPromise;
var _MessageStream_rejectEndPromise;
var _MessageStream_listeners;
var _MessageStream_ended;
var _MessageStream_errored;
var _MessageStream_aborted;
var _MessageStream_catchingPromiseCreated;
var _MessageStream_getFinalMessage;
var _MessageStream_getFinalText;
var _MessageStream_handleError;
var _MessageStream_beginRequest;
var _MessageStream_addStreamEvent;
var _MessageStream_endRequest;
var _MessageStream_accumulateMessage;
var JSON_BUF_PROPERTY2 = "__json_buf";
var MessageStream = class _MessageStream {
  static {
    __name(this, "MessageStream");
  }
  constructor() {
    _MessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _MessageStream_currentMessageSnapshot.set(this, void 0);
    this.controller = new AbortController();
    _MessageStream_connectedPromise.set(this, void 0);
    _MessageStream_resolveConnectedPromise.set(this, () => {
    });
    _MessageStream_rejectConnectedPromise.set(this, () => {
    });
    _MessageStream_endPromise.set(this, void 0);
    _MessageStream_resolveEndPromise.set(this, () => {
    });
    _MessageStream_rejectEndPromise.set(this, () => {
    });
    _MessageStream_listeners.set(this, {});
    _MessageStream_ended.set(this, false);
    _MessageStream_errored.set(this, false);
    _MessageStream_aborted.set(this, false);
    _MessageStream_catchingPromiseCreated.set(this, false);
    _MessageStream_handleError.set(this, (error3) => {
      __classPrivateFieldSet3(this, _MessageStream_errored, true, "f");
      if (error3 instanceof Error && error3.name === "AbortError") {
        error3 = new APIUserAbortError();
      }
      if (error3 instanceof APIUserAbortError) {
        __classPrivateFieldSet3(this, _MessageStream_aborted, true, "f");
        return this._emit("abort", error3);
      }
      if (error3 instanceof AnthropicError) {
        return this._emit("error", error3);
      }
      if (error3 instanceof Error) {
        const anthropicError = new AnthropicError(error3.message);
        anthropicError.cause = error3;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error3)));
    });
    __classPrivateFieldSet3(this, _MessageStream_connectedPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet3(this, _MessageStream_resolveConnectedPromise, resolve, "f");
      __classPrivateFieldSet3(this, _MessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet3(this, _MessageStream_endPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet3(this, _MessageStream_resolveEndPromise, resolve, "f");
      __classPrivateFieldSet3(this, _MessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet3(this, _MessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet3(this, _MessageStream_endPromise, "f").catch(() => {
    });
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream) {
    const runner = new _MessageStream();
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  static createMessage(messages, params, options) {
    const runner = new _MessageStream();
    for (const message of params.messages) {
      runner._addMessageParam(message);
    }
    runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet3(this, _MessageStream_handleError, "f"));
  }
  _addMessageParam(message) {
    this.messages.push(message);
  }
  _addMessage(message, emit2 = true) {
    this.receivedMessages.push(message);
    if (emit2) {
      this._emit("message", message);
    }
  }
  async _createMessage(messages, params, options) {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      signal.addEventListener("abort", () => this.controller.abort());
    }
    __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
    const stream = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal });
    this._connected();
    for await (const event of stream) {
      __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
  }
  _connected() {
    if (this.ended)
      return;
    __classPrivateFieldGet3(this, _MessageStream_resolveConnectedPromise, "f").call(this);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet3(this, _MessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet3(this, _MessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet3(this, _MessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners2 = __classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event] = []);
    listeners2.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners2 = __classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event];
    if (!listeners2)
      return this;
    const index = listeners2.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners2.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners2 = __classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event] = []);
    listeners2.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet3(this, _MessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve);
    });
  }
  async done() {
    __classPrivateFieldSet3(this, _MessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet3(this, _MessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet3(this, _MessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet3(this, _MessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet3(this, _MessageStream_ended, true, "f");
      __classPrivateFieldGet3(this, _MessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners2 = __classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event];
    if (listeners2) {
      __classPrivateFieldGet3(this, _MessageStream_listeners, "f")[event] = listeners2.filter((l) => !l.once);
      listeners2.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error3 = args[0];
      if (!__classPrivateFieldGet3(this, _MessageStream_catchingPromiseCreated, "f") && !listeners2?.length) {
        Promise.reject(error3);
      }
      __classPrivateFieldGet3(this, _MessageStream_rejectConnectedPromise, "f").call(this, error3);
      __classPrivateFieldGet3(this, _MessageStream_rejectEndPromise, "f").call(this, error3);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error3 = args[0];
      if (!__classPrivateFieldGet3(this, _MessageStream_catchingPromiseCreated, "f") && !listeners2?.length) {
        Promise.reject(error3);
      }
      __classPrivateFieldGet3(this, _MessageStream_rejectConnectedPromise, "f").call(this, error3);
      __classPrivateFieldGet3(this, _MessageStream_rejectEndPromise, "f").call(this, error3);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalMessage = this.receivedMessages.at(-1);
    if (finalMessage) {
      this._emit("finalMessage", __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      signal.addEventListener("abort", () => this.controller.abort());
    }
    __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
    this._connected();
    const stream = Stream.fromReadableStream(readableStream, this.controller);
    for await (const event of stream) {
      __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
  }
  [(_MessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _MessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_listeners = /* @__PURE__ */ new WeakMap(), _MessageStream_ended = /* @__PURE__ */ new WeakMap(), _MessageStream_errored = /* @__PURE__ */ new WeakMap(), _MessageStream_aborted = /* @__PURE__ */ new WeakMap(), _MessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _MessageStream_handleError = /* @__PURE__ */ new WeakMap(), _MessageStream_instances = /* @__PURE__ */ new WeakSet(), _MessageStream_getFinalMessage = /* @__PURE__ */ __name(function _MessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, "_MessageStream_getFinalMessage"), _MessageStream_getFinalText = /* @__PURE__ */ __name(function _MessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, "_MessageStream_getFinalText"), _MessageStream_beginRequest = /* @__PURE__ */ __name(function _MessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet3(this, _MessageStream_currentMessageSnapshot, void 0, "f");
  }, "_MessageStream_beginRequest"), _MessageStream_addStreamEvent = /* @__PURE__ */ __name(function _MessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet3(this, _MessageStream_instances, "m", _MessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        if (event.delta.type === "text_delta" && content.type === "text") {
          this._emit("text", event.delta.text, content.text || "");
        } else if (event.delta.type === "input_json_delta" && content.type === "tool_use") {
          if (content.input) {
            this._emit("inputJson", event.delta.partial_json, content.input);
          }
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(messageSnapshot);
        this._addMessage(messageSnapshot, true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet3(this, _MessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_MessageStream_addStreamEvent"), _MessageStream_endRequest = /* @__PURE__ */ __name(function _MessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet3(this, _MessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet3(this, _MessageStream_currentMessageSnapshot, void 0, "f");
    return snapshot;
  }, "_MessageStream_endRequest"), _MessageStream_accumulateMessage = /* @__PURE__ */ __name(function _MessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet3(this, _MessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        snapshot.usage.output_tokens = event.usage.output_tokens;
        return snapshot;
      case "content_block_start":
        snapshot.content.push(event.content_block);
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        if (snapshotContent?.type === "text" && event.delta.type === "text_delta") {
          snapshotContent.text += event.delta.text;
        } else if (snapshotContent?.type === "tool_use" && event.delta.type === "input_json_delta") {
          let jsonBuf = snapshotContent[JSON_BUF_PROPERTY2] || "";
          jsonBuf += event.delta.partial_json;
          Object.defineProperty(snapshotContent, JSON_BUF_PROPERTY2, {
            value: jsonBuf,
            enumerable: false,
            writable: true
          });
          if (jsonBuf) {
            snapshotContent.input = partialParse(jsonBuf);
          }
        }
        return snapshot;
      }
      case "content_block_stop":
        return snapshot;
    }
  }, "_MessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: /* @__PURE__ */ __name(async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
        }
        const chunk = pushQueue.shift();
        return { value: chunk, done: false };
      }, "next"),
      return: /* @__PURE__ */ __name(async () => {
        this.abort();
        return { value: void 0, done: true };
      }, "return")
    };
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages.mjs
var Messages3 = class extends APIResource {
  static {
    __name(this, "Messages");
  }
  create(body, options) {
    if (body.model in DEPRECATED_MODELS) {
      console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    }
    return this._client.post("/v1/messages", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      stream: body.stream ?? false
    });
  }
  /**
   * Create a Message stream
   */
  stream(body, options) {
    return MessageStream.createMessage(this, body, options);
  }
};
var DEPRECATED_MODELS = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024"
};
/* @__PURE__ */ (function(Messages4) {
})(Messages3 || (Messages3 = {}));

// node_modules/@anthropic-ai/sdk/index.mjs
var _a;
var Anthropic = class extends APIClient {
  static {
    __name(this, "Anthropic");
  }
  /**
   * API Client for interfacing with the Anthropic API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
   * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey = readEnv("ANTHROPIC_API_KEY") ?? null, authToken = readEnv("ANTHROPIC_AUTH_TOKEN") ?? null, ...opts } = {}) {
    const options = {
      apiKey,
      authToken,
      ...opts,
      baseURL: baseURL || `https://api.anthropic.com`
    };
    if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
      throw new AnthropicError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n\nTODO: link!\n");
    }
    super({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 6e5,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch
    });
    this.completions = new Completions(this);
    this.messages = new Messages3(this);
    this.beta = new Beta(this);
    this._options = options;
    this.apiKey = apiKey;
    this.authToken = authToken;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(opts) {
    return {
      ...super.defaultHeaders(opts),
      ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
      "anthropic-version": "2023-06-01",
      ...this._options.defaultHeaders
    };
  }
  validateHeaders(headers, customHeaders) {
    if (this.apiKey && headers["x-api-key"]) {
      return;
    }
    if (customHeaders["x-api-key"] === null) {
      return;
    }
    if (this.authToken && headers["authorization"]) {
      return;
    }
    if (customHeaders["authorization"] === null) {
      return;
    }
    throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  authHeaders(opts) {
    const apiKeyAuth = this.apiKeyAuth(opts);
    const bearerAuth = this.bearerAuth(opts);
    if (apiKeyAuth != null && !isEmptyObj(apiKeyAuth)) {
      return apiKeyAuth;
    }
    if (bearerAuth != null && !isEmptyObj(bearerAuth)) {
      return bearerAuth;
    }
    return {};
  }
  apiKeyAuth(opts) {
    if (this.apiKey == null) {
      return {};
    }
    return { "X-Api-Key": this.apiKey };
  }
  bearerAuth(opts) {
    if (this.authToken == null) {
      return {};
    }
    return { Authorization: `Bearer ${this.authToken}` };
  }
};
_a = Anthropic;
Anthropic.Anthropic = _a;
Anthropic.HUMAN_PROMPT = "\n\nHuman:";
Anthropic.AI_PROMPT = "\n\nAssistant:";
Anthropic.DEFAULT_TIMEOUT = 6e5;
Anthropic.AnthropicError = AnthropicError;
Anthropic.APIError = APIError;
Anthropic.APIConnectionError = APIConnectionError;
Anthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
Anthropic.APIUserAbortError = APIUserAbortError;
Anthropic.NotFoundError = NotFoundError;
Anthropic.ConflictError = ConflictError;
Anthropic.RateLimitError = RateLimitError;
Anthropic.BadRequestError = BadRequestError;
Anthropic.AuthenticationError = AuthenticationError;
Anthropic.InternalServerError = InternalServerError;
Anthropic.PermissionDeniedError = PermissionDeniedError;
Anthropic.UnprocessableEntityError = UnprocessableEntityError;
Anthropic.toFile = toFile;
Anthropic.fileFromPath = fileFromPath;
var { HUMAN_PROMPT, AI_PROMPT } = Anthropic;
var { AnthropicError: AnthropicError2, APIError: APIError2, APIConnectionError: APIConnectionError2, APIConnectionTimeoutError: APIConnectionTimeoutError2, APIUserAbortError: APIUserAbortError2, NotFoundError: NotFoundError2, ConflictError: ConflictError2, RateLimitError: RateLimitError2, BadRequestError: BadRequestError2, AuthenticationError: AuthenticationError2, InternalServerError: InternalServerError2, PermissionDeniedError: PermissionDeniedError2, UnprocessableEntityError: UnprocessableEntityError2 } = error_exports;
(function(Anthropic2) {
  Anthropic2.Page = Page;
  Anthropic2.Completions = Completions;
  Anthropic2.Messages = Messages3;
  Anthropic2.Beta = Beta;
})(Anthropic || (Anthropic = {}));
var sdk_default = Anthropic;

// src/lib/claude.ts
var SYSTEM_PROMPT = `You are the executive assistant for Kerry Kelley Jr \u2014 CEO & Chairman of Standard Black and Kasino Family Holdings. Kerry is messaging you from Telegram while away from his computer.

## Who Kerry Is
- Building a multi-industry ownership empire under the Standard Black brand
- Currently works as a car salesman at Clay Cooley Volkswagen in Richardson, TX to fund the build
- Three-person team: Kerry (CEO/Chairman), Kody Kelley (brother, CEO in training), TJ Henry (friend, execution-focused)
- Based in Central time (CST/CDT). Grew up in Rayville/Monroe, LA.

## Business Context
- **Standard Black** \u2014 primary brand, early-stage, target: household name across multiple industries
- **Kasino Family Holdings** \u2014 holding company over all assets
- **Five verticals** (priority order): cash reserves \u2192 real estate note fund \u2192 public markets \u2192 crypto (selective) \u2192 operating company acquisitions (HVAC, plumbing, construction, trucking, property management)
- **Current phase**: Phase I \u2014 build reserves, complete note education, form entity stack, begin small-scale execution
- **Long-range goal**: Rockefeller-style family-office architecture \u2014 multigenerational capital control

## Current Priorities (Q2 2026)
1. Note course & mentorship \u2014 live coaching with Desi Arnez, goal: 2\u20133 independent transactions
2. Note business operating system \u2014 structured OS with AI integration throughout
3. Team leadership framework \u2014 defined roles, meeting cadence, accountability system
4. Entity structure setup \u2014 Rockefeller-style entity stack, target ~Nov 2026
5. Team payment structure \u2014 contribution model for the three-person team

## How to Respond
- Direct and applicable \u2014 no fluff, no filler
- Lead with the answer or action, then support it
- Mix of corporate confidence and plain directness \u2014 not stiff, not casual
- Keep responses concise for mobile reading \u2014 short paragraphs, bullets when listing
- Never use emojis unless Kerry uses them first
- If Kerry asks you to do something that requires his local Claude Code session (file edits, email, calendar), acknowledge it and tell him it'll be waiting when he gets back

Current date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "America/Chicago"
})}`;
async function generateResponse(apiKey, history, userMessage) {
  const client = new sdk_default({ apiKey });
  const messages = [
    ...history,
    { role: "user", content: userMessage }
  ];
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected Claude response type");
  return block.text;
}
__name(generateResponse, "generateResponse");

// node_modules/uncrypto/dist/crypto.web.mjs
var webCrypto = globalThis.crypto;
var subtle = webCrypto.subtle;

// node_modules/@upstash/redis/chunk-2X4SLXT7.mjs
var __defProp2 = Object.defineProperty;
var __export2 = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
var error_exports2 = {};
__export2(error_exports2, {
  UpstashError: /* @__PURE__ */ __name(() => UpstashError, "UpstashError"),
  UpstashJSONParseError: /* @__PURE__ */ __name(() => UpstashJSONParseError, "UpstashJSONParseError"),
  UrlError: /* @__PURE__ */ __name(() => UrlError, "UrlError")
});
var UpstashError = class extends Error {
  static {
    __name(this, "UpstashError");
  }
  constructor(message, options) {
    super(message, options);
    this.name = "UpstashError";
  }
};
var UrlError = class extends Error {
  static {
    __name(this, "UrlError");
  }
  constructor(url) {
    super(
      `Upstash Redis client was passed an invalid URL. You should pass a URL starting with https. Received: "${url}". `
    );
    this.name = "UrlError";
  }
};
var UpstashJSONParseError = class extends UpstashError {
  static {
    __name(this, "UpstashJSONParseError");
  }
  constructor(body, options) {
    const truncatedBody = body.length > 200 ? body.slice(0, 200) + "..." : body;
    super(`Unable to parse response body: ${truncatedBody}`, options);
    this.name = "UpstashJSONParseError";
  }
};
function parseRecursive(obj) {
  const parsed = Array.isArray(obj) ? obj.map((o) => {
    try {
      return parseRecursive(o);
    } catch {
      return o;
    }
  }) : JSON.parse(obj);
  if (typeof parsed === "number" && parsed.toString() !== obj) {
    return obj;
  }
  return parsed;
}
__name(parseRecursive, "parseRecursive");
function parseResponse(result) {
  try {
    return parseRecursive(result);
  } catch {
    return result;
  }
}
__name(parseResponse, "parseResponse");
function deserializeScanResponse(result) {
  return [result[0], ...parseResponse(result.slice(1))];
}
__name(deserializeScanResponse, "deserializeScanResponse");
function deserializeScanWithTypesResponse(result) {
  const [cursor, keys] = result;
  const parsedKeys = [];
  for (let i = 0; i < keys.length; i += 2) {
    parsedKeys.push({ key: keys[i], type: keys[i + 1] });
  }
  return [cursor, parsedKeys];
}
__name(deserializeScanWithTypesResponse, "deserializeScanWithTypesResponse");
function mergeHeaders(...headers) {
  const merged = {};
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of Object.entries(header)) {
      if (value !== void 0 && value !== null) {
        merged[key] = value;
      }
    }
  }
  return merged;
}
__name(mergeHeaders, "mergeHeaders");
function kvArrayToObject(v) {
  if (typeof v === "object" && v !== null && !Array.isArray(v)) return v;
  if (!Array.isArray(v)) return {};
  const obj = {};
  for (let i = 0; i < v.length; i += 2) {
    if (typeof v[i] === "string") obj[v[i]] = v[i + 1];
  }
  return obj;
}
__name(kvArrayToObject, "kvArrayToObject");
var MAX_BUFFER_SIZE = 1024 * 1024;
var HttpClient = class {
  static {
    __name(this, "HttpClient");
  }
  baseUrl;
  headers;
  options;
  readYourWrites;
  upstashSyncToken = "";
  hasCredentials;
  retry;
  constructor(config2) {
    this.options = {
      backend: config2.options?.backend,
      agent: config2.agent,
      responseEncoding: config2.responseEncoding ?? "base64",
      // default to base64
      cache: config2.cache,
      signal: config2.signal,
      keepAlive: config2.keepAlive ?? true
    };
    this.upstashSyncToken = "";
    this.readYourWrites = config2.readYourWrites ?? true;
    this.baseUrl = (config2.baseUrl || "").replace(/\/$/, "");
    const urlRegex = /^https?:\/\/[^\s#$./?].\S*$/;
    if (this.baseUrl && !urlRegex.test(this.baseUrl)) {
      throw new UrlError(this.baseUrl);
    }
    this.headers = {
      "Content-Type": "application/json",
      ...config2.headers
    };
    this.hasCredentials = Boolean(this.baseUrl && this.headers.authorization.split(" ")[1]);
    if (this.options.responseEncoding === "base64") {
      this.headers["Upstash-Encoding"] = "base64";
    }
    this.retry = typeof config2.retry === "boolean" && !config2.retry ? {
      attempts: 1,
      backoff: /* @__PURE__ */ __name(() => 0, "backoff")
    } : {
      attempts: config2.retry?.retries ?? 5,
      backoff: config2.retry?.backoff ?? ((retryCount) => Math.exp(retryCount) * 50)
    };
  }
  mergeTelemetry(telemetry) {
    this.headers = merge(this.headers, "Upstash-Telemetry-Runtime", telemetry.runtime);
    this.headers = merge(this.headers, "Upstash-Telemetry-Platform", telemetry.platform);
    this.headers = merge(this.headers, "Upstash-Telemetry-Sdk", telemetry.sdk);
  }
  async request(req) {
    const requestHeaders = mergeHeaders(this.headers, req.headers ?? {});
    const requestUrl = [this.baseUrl, ...req.path ?? []].join("/");
    const isEventStream = requestHeaders.Accept === "text/event-stream";
    const signal = req.signal ?? this.options.signal;
    const isSignalFunction = typeof signal === "function";
    const requestOptions = {
      cache: this.options.cache,
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(req.body),
      keepalive: this.options.keepAlive,
      agent: this.options.agent,
      signal: isSignalFunction ? signal() : signal,
      /**
       * Fastly specific
       */
      backend: this.options.backend
    };
    if (!this.hasCredentials) {
      console.warn(
        "[Upstash Redis] Redis client was initialized without url or token. Failed to execute command."
      );
    }
    if (this.readYourWrites) {
      const newHeader = this.upstashSyncToken;
      this.headers["upstash-sync-token"] = newHeader;
    }
    let res = null;
    let error3 = null;
    for (let i = 0; i <= this.retry.attempts; i++) {
      try {
        res = await fetch(requestUrl, requestOptions);
        break;
      } catch (error_) {
        if (requestOptions.signal?.aborted && isSignalFunction) {
          throw error_;
        } else if (requestOptions.signal?.aborted) {
          const myBlob = new Blob([
            JSON.stringify({ result: requestOptions.signal.reason ?? "Aborted" })
          ]);
          const myOptions = {
            status: 200,
            statusText: requestOptions.signal.reason ?? "Aborted"
          };
          res = new Response(myBlob, myOptions);
          break;
        }
        error3 = error_;
        if (i < this.retry.attempts) {
          await new Promise((r) => setTimeout(r, this.retry.backoff(i)));
        }
      }
    }
    if (!res) {
      throw error3 ?? new Error("Exhausted all retries");
    }
    if (!res.ok) {
      let body2;
      const rawBody2 = await res.text();
      try {
        body2 = JSON.parse(rawBody2);
      } catch (error22) {
        throw new UpstashJSONParseError(rawBody2, { cause: error22 });
      }
      throw new UpstashError(`${body2.error}, command was: ${JSON.stringify(req.body)}`);
    }
    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }
    if (isEventStream && req && req.onMessage && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      (async () => {
        try {
          let buffer = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            if (buffer.length > MAX_BUFFER_SIZE) {
              throw new Error("Buffer size exceeded (1MB)");
            }
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                req.onMessage?.(data);
              }
            }
          }
        } catch (error22) {
          if (error22 instanceof Error && error22.name === "AbortError") {
          } else {
            console.error("Stream reading error:", error22);
          }
        } finally {
          try {
            await reader.cancel();
          } catch {
          }
        }
      })();
      return { result: 1 };
    }
    let body;
    const rawBody = await res.text();
    try {
      body = JSON.parse(rawBody);
    } catch (error22) {
      throw new UpstashJSONParseError(rawBody, { cause: error22 });
    }
    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }
    if (this.options.responseEncoding === "base64") {
      if (Array.isArray(body)) {
        return body.map(({ result: result2, error: error22 }) => ({
          result: decode(result2),
          error: error22
        }));
      }
      const result = decode(body.result);
      return { result, error: body.error };
    }
    return body;
  }
};
function base64decode(b64) {
  let dec = "";
  try {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    dec = new TextDecoder().decode(bytes);
  } catch {
    dec = b64;
  }
  return dec;
}
__name(base64decode, "base64decode");
function decode(raw) {
  let result = void 0;
  switch (typeof raw) {
    case "undefined": {
      return raw;
    }
    case "number": {
      result = raw;
      break;
    }
    case "object": {
      if (Array.isArray(raw)) {
        result = raw.map(
          (v) => typeof v === "string" ? base64decode(v) : Array.isArray(v) ? v.map((element) => decode(element)) : v
        );
      } else {
        result = null;
      }
      break;
    }
    case "string": {
      result = raw === "OK" ? "OK" : base64decode(raw);
      break;
    }
    default: {
      break;
    }
  }
  return result;
}
__name(decode, "decode");
function merge(obj, key, value) {
  if (!value) {
    return obj;
  }
  obj[key] = obj[key] ? [obj[key], value].join(",") : value;
  return obj;
}
__name(merge, "merge");
var defaultSerializer = /* @__PURE__ */ __name((c) => {
  switch (typeof c) {
    case "string":
    case "number":
    case "boolean": {
      return c;
    }
    default: {
      return JSON.stringify(c);
    }
  }
}, "defaultSerializer");
var Command = class {
  static {
    __name(this, "Command");
  }
  command;
  serialize;
  deserialize;
  headers;
  path;
  onMessage;
  isStreaming;
  signal;
  /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(command, opts) {
    this.serialize = defaultSerializer;
    this.deserialize = opts?.automaticDeserialization === void 0 || opts.automaticDeserialization ? opts?.deserialize ?? parseResponse : (x) => x;
    this.command = command.map((c) => this.serialize(c));
    this.headers = opts?.headers;
    this.path = opts?.path;
    this.onMessage = opts?.streamOptions?.onMessage;
    this.isStreaming = opts?.streamOptions?.isStreaming ?? false;
    this.signal = opts?.streamOptions?.signal;
    if (opts?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async (client) => {
        const start = performance.now();
        const result = await originalExec(client);
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        console.log(
          `Latency for \x1B[38;2;19;185;39m${this.command[0].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${loggerResult} ms\x1B[0m`
        );
        return result;
      };
    }
  }
  /**
   * Execute the command using a client.
   */
  async exec(client) {
    const { result, error: error3 } = await client.request({
      body: this.command,
      path: this.path,
      upstashSyncToken: client.upstashSyncToken,
      headers: this.headers,
      onMessage: this.onMessage,
      isStreaming: this.isStreaming,
      signal: this.signal
    });
    if (error3) {
      throw new UpstashError(error3);
    }
    if (result === void 0) {
      throw new TypeError("Request did not return a result");
    }
    return this.deserialize(result);
  }
};
var ExecCommand = class extends Command {
  static {
    __name(this, "ExecCommand");
  }
  constructor(cmd, opts) {
    const normalizedCmd = cmd.map((arg) => typeof arg === "string" ? arg : String(arg));
    super(normalizedCmd, opts);
  }
};
var FIELD_TYPES = [
  "TEXT",
  "U64",
  "I64",
  "F64",
  "BOOL",
  "DATE",
  "KEYWORD",
  "FACET"
];
function isFieldType(value) {
  return typeof value === "string" && FIELD_TYPES.includes(value);
}
__name(isFieldType, "isFieldType");
function isDetailedField(value) {
  return typeof value === "object" && value !== null && "type" in value && isFieldType(value.type);
}
__name(isDetailedField, "isDetailedField");
function isNestedSchema(value) {
  return typeof value === "object" && value !== null && !isDetailedField(value);
}
__name(isNestedSchema, "isNestedSchema");
function flattenSchema(schema, pathPrefix = []) {
  const fields = [];
  for (const [key, value] of Object.entries(schema)) {
    const currentPath = [...pathPrefix, key];
    const pathString = currentPath.join(".");
    if (isFieldType(value)) {
      fields.push({
        path: pathString,
        type: value
      });
    } else if (isDetailedField(value)) {
      fields.push({
        path: pathString,
        type: value.type,
        fast: "fast" in value ? value.fast : void 0,
        noTokenize: "noTokenize" in value ? value.noTokenize : void 0,
        noStem: "noStem" in value ? value.noStem : void 0,
        from: "from" in value ? value.from : void 0
      });
    } else if (isNestedSchema(value)) {
      const nestedFields = flattenSchema(value, currentPath);
      fields.push(...nestedFields);
    }
  }
  return fields;
}
__name(flattenSchema, "flattenSchema");
function deserializeQueryResponse(rawResponse) {
  return rawResponse.map((itemRaw) => {
    const raw = itemRaw;
    const key = raw[0];
    const score = Number(raw[1]);
    const rawFields = raw[2];
    if (rawFields === void 0) {
      return { key, score };
    }
    if (!Array.isArray(rawFields) || rawFields.length === 0) {
      return { key, score, data: {} };
    }
    let data = {};
    for (const fieldRaw of rawFields) {
      const key2 = fieldRaw[0];
      const value = fieldRaw[1];
      const pathParts = key2.split(".");
      if (pathParts.length === 1) {
        data[key2] = value;
      } else {
        let currentObj = data;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const pathPart = pathParts[i];
          if (!(pathPart in currentObj)) {
            currentObj[pathPart] = {};
          }
          currentObj = currentObj[pathPart];
        }
        currentObj[pathParts.at(-1)] = value;
      }
    }
    if ("$" in data) {
      data = data["$"];
    }
    return { key, score, data };
  });
}
__name(deserializeQueryResponse, "deserializeQueryResponse");
function deserializeDescribeResponse(rawResponse) {
  const description = {};
  for (let i = 0; i < rawResponse.length; i += 2) {
    const descriptor = rawResponse[i];
    switch (descriptor) {
      case "name": {
        description["name"] = rawResponse[i + 1];
        break;
      }
      case "type": {
        description["dataType"] = rawResponse[i + 1].toLowerCase();
        break;
      }
      case "prefixes": {
        description["prefixes"] = rawResponse[i + 1];
        break;
      }
      case "language": {
        description["language"] = rawResponse[i + 1];
        break;
      }
      case "schema": {
        const schema = {};
        for (const fieldDescription of rawResponse[i + 1]) {
          const fieldName = fieldDescription[0];
          const fieldInfo = { type: fieldDescription[1] };
          if (fieldDescription.length > 2) {
            for (let j = 2; j < fieldDescription.length; j++) {
              const fieldOption = fieldDescription[j];
              switch (fieldOption) {
                case "NOSTEM": {
                  fieldInfo.noStem = true;
                  break;
                }
                case "NOTOKENIZE": {
                  fieldInfo.noTokenize = true;
                  break;
                }
                case "FAST": {
                  fieldInfo.fast = true;
                  break;
                }
                case "FROM": {
                  fieldInfo.from = fieldDescription[++j];
                  break;
                }
              }
            }
          }
          schema[fieldName] = fieldInfo;
        }
        description["schema"] = schema;
        break;
      }
    }
  }
  return description;
}
__name(deserializeDescribeResponse, "deserializeDescribeResponse");
function parseCountResponse(rawResponse) {
  return typeof rawResponse === "number" ? rawResponse : Number.parseInt(rawResponse, 10);
}
__name(parseCountResponse, "parseCountResponse");
function deserializeAggregateResponse(rawResponse) {
  return parseAggregationArray(rawResponse);
}
__name(deserializeAggregateResponse, "deserializeAggregateResponse");
function parseAggregationArray(arr) {
  const result = {};
  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "string") {
        result[key] = value[0] === "buckets" ? parseBucketsValue(value) : parseStatsValue(value);
      } else {
        result[key] = parseAggregationArray(value);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
__name(parseAggregationArray, "parseAggregationArray");
function coerceNumericString(value) {
  if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}
__name(coerceNumericString, "coerceNumericString");
function parseStatsValue(arr) {
  const result = {};
  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    if (Array.isArray(value) && value.length > 0) {
      if (typeof value[0] === "string") {
        result[key] = parseStatsValue(value);
      } else if (Array.isArray(value[0]) && typeof value[0][0] === "string") {
        result[key] = value.map((item) => parseStatsValue(item));
      } else {
        result[key] = value;
      }
    } else {
      result[key] = coerceNumericString(value);
    }
  }
  return result;
}
__name(parseStatsValue, "parseStatsValue");
function parseBucketsValue(arr) {
  if (arr[0] === "buckets" && Array.isArray(arr[1])) {
    const result = {
      buckets: arr[1].map((bucket) => {
        const bucketObj = {};
        for (let i = 0; i < bucket.length; i += 2) {
          const key = bucket[i];
          const value = bucket[i + 1];
          bucketObj[key] = Array.isArray(value) && value.length > 0 && typeof value[0] === "string" ? parseStatsValue(value) : value;
        }
        return bucketObj;
      })
    };
    for (let i = 2; i < arr.length; i += 2) {
      result[arr[i]] = arr[i + 1];
    }
    return result;
  }
  return arr;
}
__name(parseBucketsValue, "parseBucketsValue");
function buildQueryCommand(redisCommand, name, options) {
  const query = JSON.stringify(options?.filter ?? {});
  const command = [redisCommand, name, query];
  if (options?.limit !== void 0) {
    command.push("LIMIT", options.limit.toString());
  }
  if (options?.offset !== void 0) {
    command.push("OFFSET", options.offset.toString());
  }
  if (options?.select && Object.keys(options.select).length === 0) {
    command.push("NOCONTENT");
  }
  if (options) {
    if ("orderBy" in options && options.orderBy) {
      command.push("ORDERBY");
      for (const [field, direction] of Object.entries(options.orderBy)) {
        command.push(field, direction);
      }
    } else if ("scoreFunc" in options && options.scoreFunc) {
      command.push("SCOREFUNC", ...buildScoreFunc(options.scoreFunc));
    }
  }
  if (options?.highlight) {
    command.push(
      "HIGHLIGHT",
      "FIELDS",
      options.highlight.fields.length.toString(),
      ...options.highlight.fields
    );
    if (options.highlight.preTag && options.highlight.postTag) {
      command.push("TAGS", options.highlight.preTag, options.highlight.postTag);
    }
  }
  if (options?.select && Object.keys(options.select).length > 0) {
    command.push(
      "SELECT",
      Object.keys(options.select).length.toString(),
      ...Object.keys(options.select)
    );
  }
  return command;
}
__name(buildQueryCommand, "buildQueryCommand");
function buildScoreFunc(scoreBy) {
  const result = [];
  if (typeof scoreBy === "string") {
    result.push("FIELDVALUE", scoreBy);
  } else if ("fields" in scoreBy) {
    if (scoreBy.combineMode) {
      result.push("COMBINEMODE", scoreBy.combineMode.toUpperCase());
    }
    if (scoreBy.scoreMode) {
      result.push("SCOREMODE", scoreBy.scoreMode.toUpperCase());
    }
    for (const field of scoreBy.fields) {
      result.push(...buildScoreFuncField(field));
    }
  } else {
    result.push(...buildScoreFuncField(scoreBy));
  }
  return result;
}
__name(buildScoreFunc, "buildScoreFunc");
function buildScoreFuncField(field) {
  const result = [];
  if (typeof field === "string") {
    result.push("FIELDVALUE", field);
  } else {
    if (field.scoreMode) {
      result.push("SCOREMODE", field.scoreMode.toUpperCase());
    }
    result.push("FIELDVALUE", field.field);
    if (field.modifier) {
      result.push("MODIFIER", field.modifier.toUpperCase());
    }
    if (field.factor !== void 0) {
      result.push("FACTOR", field.factor.toString());
    }
    if (field.missing !== void 0) {
      result.push("MISSING", field.missing.toString());
    }
  }
  return result;
}
__name(buildScoreFuncField, "buildScoreFuncField");
function buildCreateIndexCommand(params) {
  const { name, schema, dataType, prefix, language, skipInitialScan, existsOk } = params;
  const prefixArray = Array.isArray(prefix) ? prefix : [prefix];
  const payload = [
    name,
    ...skipInitialScan ? ["SKIPINITIALSCAN"] : [],
    ...existsOk ? ["EXISTSOK"] : [],
    "ON",
    dataType.toUpperCase(),
    "PREFIX",
    prefixArray.length.toString(),
    ...prefixArray,
    ...language ? ["LANGUAGE", language] : [],
    "SCHEMA"
  ];
  const fields = flattenSchema(schema);
  for (const field of fields) {
    payload.push(field.path, field.type);
    if (field.fast) {
      payload.push("FAST");
    }
    if (field.noTokenize) {
      payload.push("NOTOKENIZE");
    }
    if (field.noStem) {
      payload.push("NOSTEM");
    }
    if (field.from) {
      payload.push("FROM", field.from);
    }
  }
  return ["SEARCH.CREATE", ...payload];
}
__name(buildCreateIndexCommand, "buildCreateIndexCommand");
function buildAggregateCommand(name, options) {
  const query = JSON.stringify(options?.filter ?? {});
  const aggregations = JSON.stringify(options.aggregations);
  return ["SEARCH.AGGREGATE", name, query, aggregations];
}
__name(buildAggregateCommand, "buildAggregateCommand");
var SearchIndex = class {
  static {
    __name(this, "SearchIndex");
  }
  name;
  schema;
  client;
  constructor({ name, schema, client }) {
    this.name = name;
    this.schema = schema;
    this.client = client;
  }
  async waitIndexing() {
    const command = ["SEARCH.WAITINDEXING", this.name];
    return await new ExecCommand(command).exec(this.client);
  }
  async describe() {
    const command = ["SEARCH.DESCRIBE", this.name];
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    if (!rawResult) return null;
    return deserializeDescribeResponse(rawResult);
  }
  async query(options) {
    const command = buildQueryCommand("SEARCH.QUERY", this.name, options);
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    if (!rawResult) return rawResult;
    return deserializeQueryResponse(rawResult);
  }
  async aggregate(options) {
    const command = buildAggregateCommand(this.name, options);
    const rawResult = await new ExecCommand(
      command
    ).exec(this.client);
    return deserializeAggregateResponse(rawResult);
  }
  async count({ filter }) {
    const command = buildQueryCommand("SEARCH.COUNT", this.name, { filter });
    const rawResult = await new ExecCommand(command).exec(
      this.client
    );
    return { count: parseCountResponse(rawResult) };
  }
  async drop() {
    const command = ["SEARCH.DROP", this.name];
    const result = await new ExecCommand(command).exec(this.client);
    return result;
  }
  async addAlias({ alias }) {
    const command = ["SEARCH.ALIASADD", alias, this.name];
    const result = await new ExecCommand(command).exec(this.client);
    return result;
  }
};
async function createIndex(client, params) {
  const { name, schema } = params;
  const createIndexCommand = buildCreateIndexCommand(params);
  await new ExecCommand(createIndexCommand).exec(client);
  return initIndex(client, { name, schema });
}
__name(createIndex, "createIndex");
function initIndex(client, params) {
  const { name, schema } = params;
  return new SearchIndex({ name, schema, client });
}
__name(initIndex, "initIndex");
async function listAliases(client) {
  const command = ["SEARCH.LISTALIASES"];
  const rawResult = await new ExecCommand(command).exec(client);
  if (rawResult === 0 || Array.isArray(rawResult) && rawResult.length === 0) {
    return {};
  }
  if (!Array.isArray(rawResult)) {
    return {};
  }
  const aliases = {};
  for (const pair of rawResult) {
    if (Array.isArray(pair) && pair.length === 2) {
      const [alias, index] = pair;
      aliases[alias] = index;
    }
  }
  return aliases;
}
__name(listAliases, "listAliases");
async function addAlias(client, { indexName, alias }) {
  const command = ["SEARCH.ALIASADD", alias, indexName];
  const result = await new ExecCommand(command).exec(client);
  return result;
}
__name(addAlias, "addAlias");
async function delAlias(client, { alias }) {
  const command = ["SEARCH.ALIASDEL", alias];
  const result = await new ExecCommand(command).exec(client);
  return result;
}
__name(delAlias, "delAlias");
function deserialize(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      obj[key] = JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj;
}
__name(deserialize, "deserialize");
var HRandFieldCommand = class extends Command {
  static {
    __name(this, "HRandFieldCommand");
  }
  constructor(cmd, opts) {
    const command = ["hrandfield", cmd[0]];
    if (typeof cmd[1] === "number") {
      command.push(cmd[1]);
    }
    if (cmd[2]) {
      command.push("WITHVALUES");
    }
    super(command, {
      // @ts-expect-error to silence compiler
      deserialize: cmd[2] ? (result) => deserialize(result) : opts?.deserialize,
      ...opts
    });
  }
};
var AppendCommand = class extends Command {
  static {
    __name(this, "AppendCommand");
  }
  constructor(cmd, opts) {
    super(["append", ...cmd], opts);
  }
};
var BitCountCommand = class extends Command {
  static {
    __name(this, "BitCountCommand");
  }
  constructor([key, start, end], opts) {
    const command = ["bitcount", key];
    if (typeof start === "number") {
      command.push(start);
    }
    if (typeof end === "number") {
      command.push(end);
    }
    super(command, opts);
  }
};
var BitFieldCommand = class {
  static {
    __name(this, "BitFieldCommand");
  }
  constructor(args, client, opts, execOperation = (command) => command.exec(this.client)) {
    this.client = client;
    this.opts = opts;
    this.execOperation = execOperation;
    this.command = ["bitfield", ...args];
  }
  command;
  chain(...args) {
    this.command.push(...args);
    return this;
  }
  get(...args) {
    return this.chain("get", ...args);
  }
  set(...args) {
    return this.chain("set", ...args);
  }
  incrby(...args) {
    return this.chain("incrby", ...args);
  }
  overflow(overflow) {
    return this.chain("overflow", overflow);
  }
  exec() {
    const command = new Command(this.command, this.opts);
    return this.execOperation(command);
  }
};
var BitOpCommand = class extends Command {
  static {
    __name(this, "BitOpCommand");
  }
  constructor(cmd, opts) {
    super(["bitop", ...cmd], opts);
  }
};
var BitPosCommand = class extends Command {
  static {
    __name(this, "BitPosCommand");
  }
  constructor(cmd, opts) {
    super(["bitpos", ...cmd], opts);
  }
};
var ClientSetInfoCommand = class extends Command {
  static {
    __name(this, "ClientSetInfoCommand");
  }
  constructor([attribute, value], opts) {
    super(["CLIENT", "SETINFO", attribute.toUpperCase(), value], opts);
  }
};
var CopyCommand = class extends Command {
  static {
    __name(this, "CopyCommand");
  }
  constructor([key, destinationKey, opts], commandOptions) {
    super(["COPY", key, destinationKey, ...opts?.replace ? ["REPLACE"] : []], {
      ...commandOptions,
      deserialize(result) {
        if (result > 0) {
          return "COPIED";
        }
        return "NOT_COPIED";
      }
    });
  }
};
var DBSizeCommand = class extends Command {
  static {
    __name(this, "DBSizeCommand");
  }
  constructor(opts) {
    super(["dbsize"], opts);
  }
};
var DecrCommand = class extends Command {
  static {
    __name(this, "DecrCommand");
  }
  constructor(cmd, opts) {
    super(["decr", ...cmd], opts);
  }
};
var DecrByCommand = class extends Command {
  static {
    __name(this, "DecrByCommand");
  }
  constructor(cmd, opts) {
    super(["decrby", ...cmd], opts);
  }
};
var DelCommand = class extends Command {
  static {
    __name(this, "DelCommand");
  }
  constructor(cmd, opts) {
    super(["del", ...cmd], opts);
  }
};
var EchoCommand = class extends Command {
  static {
    __name(this, "EchoCommand");
  }
  constructor(cmd, opts) {
    super(["echo", ...cmd], opts);
  }
};
var EvalROCommand = class extends Command {
  static {
    __name(this, "EvalROCommand");
  }
  constructor([script, keys, args], opts) {
    super(["eval_ro", script, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalCommand = class extends Command {
  static {
    __name(this, "EvalCommand");
  }
  constructor([script, keys, args], opts) {
    super(["eval", script, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalshaROCommand = class extends Command {
  static {
    __name(this, "EvalshaROCommand");
  }
  constructor([sha, keys, args], opts) {
    super(["evalsha_ro", sha, keys.length, ...keys, ...args ?? []], opts);
  }
};
var EvalshaCommand = class extends Command {
  static {
    __name(this, "EvalshaCommand");
  }
  constructor([sha, keys, args], opts) {
    super(["evalsha", sha, keys.length, ...keys, ...args ?? []], opts);
  }
};
var ExistsCommand = class extends Command {
  static {
    __name(this, "ExistsCommand");
  }
  constructor(cmd, opts) {
    super(["exists", ...cmd], opts);
  }
};
var ExpireCommand = class extends Command {
  static {
    __name(this, "ExpireCommand");
  }
  constructor(cmd, opts) {
    super(["expire", ...cmd.filter(Boolean)], opts);
  }
};
var ExpireAtCommand = class extends Command {
  static {
    __name(this, "ExpireAtCommand");
  }
  constructor(cmd, opts) {
    super(["expireat", ...cmd], opts);
  }
};
var FCallCommand = class extends Command {
  static {
    __name(this, "FCallCommand");
  }
  constructor([functionName, keys, args], opts) {
    super(["fcall", functionName, ...keys ? [keys.length, ...keys] : [0], ...args ?? []], opts);
  }
};
var FCallRoCommand = class extends Command {
  static {
    __name(this, "FCallRoCommand");
  }
  constructor([functionName, keys, args], opts) {
    super(
      ["fcall_ro", functionName, ...keys ? [keys.length, ...keys] : [0], ...args ?? []],
      opts
    );
  }
};
var FlushAllCommand = class extends Command {
  static {
    __name(this, "FlushAllCommand");
  }
  constructor(args, opts) {
    const command = ["flushall"];
    if (args && args.length > 0 && args[0].async) {
      command.push("async");
    }
    super(command, opts);
  }
};
var FlushDBCommand = class extends Command {
  static {
    __name(this, "FlushDBCommand");
  }
  constructor([opts], cmdOpts) {
    const command = ["flushdb"];
    if (opts?.async) {
      command.push("async");
    }
    super(command, cmdOpts);
  }
};
var FunctionDeleteCommand = class extends Command {
  static {
    __name(this, "FunctionDeleteCommand");
  }
  constructor([libraryName], opts) {
    super(["function", "delete", libraryName], opts);
  }
};
var FunctionFlushCommand = class extends Command {
  static {
    __name(this, "FunctionFlushCommand");
  }
  constructor(opts) {
    super(["function", "flush"], opts);
  }
};
var FunctionListCommand = class extends Command {
  static {
    __name(this, "FunctionListCommand");
  }
  constructor([args], opts) {
    const command = ["function", "list"];
    if (args?.libraryName) {
      command.push("libraryname", args.libraryName);
    }
    if (args?.withCode) {
      command.push("withcode");
    }
    super(command, { deserialize: deserialize2, ...opts });
  }
};
function deserialize2(result) {
  if (!Array.isArray(result)) return [];
  return result.map((libRaw) => {
    const lib = kvArrayToObject(libRaw);
    const functionsParsed = lib.functions.map(
      (fnRaw) => kvArrayToObject(fnRaw)
    );
    return {
      libraryName: lib.library_name,
      engine: lib.engine,
      functions: functionsParsed.map((fn) => ({
        name: fn.name,
        description: fn.description ?? void 0,
        flags: fn.flags
      })),
      libraryCode: lib.library_code
    };
  });
}
__name(deserialize2, "deserialize2");
var FunctionLoadCommand = class extends Command {
  static {
    __name(this, "FunctionLoadCommand");
  }
  constructor([args], opts) {
    super(["function", "load", ...args.replace ? ["replace"] : [], args.code], opts);
  }
};
var FunctionStatsCommand = class extends Command {
  static {
    __name(this, "FunctionStatsCommand");
  }
  constructor(opts) {
    super(["function", "stats"], { deserialize: deserialize3, ...opts });
  }
};
function deserialize3(result) {
  const rawEngines = kvArrayToObject(kvArrayToObject(result).engines);
  const parsedEngines = Object.fromEntries(
    Object.entries(rawEngines).map(([key, value]) => [key, kvArrayToObject(value)])
  );
  const final = {
    engines: Object.fromEntries(
      Object.entries(parsedEngines).map(([key, value]) => [
        key,
        {
          librariesCount: value.libraries_count,
          functionsCount: value.functions_count
        }
      ])
    )
  };
  return final;
}
__name(deserialize3, "deserialize3");
var GeoAddCommand = class extends Command {
  static {
    __name(this, "GeoAddCommand");
  }
  constructor([key, arg1, ...arg2], opts) {
    const command = ["geoadd", key];
    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }
    if ("latitude" in arg1 && arg1.latitude) {
      command.push(arg1.longitude, arg1.latitude, arg1.member);
    }
    command.push(
      ...arg2.flatMap(({ latitude, longitude, member }) => [longitude, latitude, member])
    );
    super(command, opts);
  }
};
var GeoDistCommand = class extends Command {
  static {
    __name(this, "GeoDistCommand");
  }
  constructor([key, member1, member2, unit = "M"], opts) {
    super(["GEODIST", key, member1, member2, unit], opts);
  }
};
var GeoHashCommand = class extends Command {
  static {
    __name(this, "GeoHashCommand");
  }
  constructor(cmd, opts) {
    const [key] = cmd;
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
    super(["GEOHASH", key, ...members], opts);
  }
};
var GeoPosCommand = class extends Command {
  static {
    __name(this, "GeoPosCommand");
  }
  constructor(cmd, opts) {
    const [key] = cmd;
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
    super(["GEOPOS", key, ...members], {
      deserialize: /* @__PURE__ */ __name((result) => transform(result), "deserialize"),
      ...opts
    });
  }
};
function transform(result) {
  const final = [];
  for (const pos of result) {
    if (!pos?.[0] || !pos?.[1]) {
      continue;
    }
    final.push({ lng: Number.parseFloat(pos[0]), lat: Number.parseFloat(pos[1]) });
  }
  return final;
}
__name(transform, "transform");
var GeoSearchCommand = class extends Command {
  static {
    __name(this, "GeoSearchCommand");
  }
  constructor([key, centerPoint, shape, order, opts], commandOptions) {
    const command = ["GEOSEARCH", key];
    if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
      command.push(centerPoint.type, centerPoint.member);
    }
    if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
      command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
    }
    if (shape.type === "BYRADIUS" || shape.type === "byradius") {
      command.push(shape.type, shape.radius, shape.radiusType);
    }
    if (shape.type === "BYBOX" || shape.type === "bybox") {
      command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
    }
    command.push(order);
    if (opts?.count) {
      command.push("COUNT", opts.count.limit, ...opts.count.any ? ["ANY"] : []);
    }
    const transform2 = /* @__PURE__ */ __name((result) => {
      if (!opts?.withCoord && !opts?.withDist && !opts?.withHash) {
        return result.map((member) => {
          try {
            return { member: JSON.parse(member) };
          } catch {
            return { member };
          }
        });
      }
      return result.map((members) => {
        let counter = 1;
        const obj = {};
        try {
          obj.member = JSON.parse(members[0]);
        } catch {
          obj.member = members[0];
        }
        if (opts.withDist) {
          obj.dist = Number.parseFloat(members[counter++]);
        }
        if (opts.withHash) {
          obj.hash = members[counter++].toString();
        }
        if (opts.withCoord) {
          obj.coord = {
            long: Number.parseFloat(members[counter][0]),
            lat: Number.parseFloat(members[counter][1])
          };
        }
        return obj;
      });
    }, "transform2");
    super(
      [
        ...command,
        ...opts?.withCoord ? ["WITHCOORD"] : [],
        ...opts?.withDist ? ["WITHDIST"] : [],
        ...opts?.withHash ? ["WITHHASH"] : []
      ],
      {
        deserialize: transform2,
        ...commandOptions
      }
    );
  }
};
var GeoSearchStoreCommand = class extends Command {
  static {
    __name(this, "GeoSearchStoreCommand");
  }
  constructor([destination, key, centerPoint, shape, order, opts], commandOptions) {
    const command = ["GEOSEARCHSTORE", destination, key];
    if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
      command.push(centerPoint.type, centerPoint.member);
    }
    if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
      command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
    }
    if (shape.type === "BYRADIUS" || shape.type === "byradius") {
      command.push(shape.type, shape.radius, shape.radiusType);
    }
    if (shape.type === "BYBOX" || shape.type === "bybox") {
      command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
    }
    command.push(order);
    if (opts?.count) {
      command.push("COUNT", opts.count.limit, ...opts.count.any ? ["ANY"] : []);
    }
    super([...command, ...opts?.storeDist ? ["STOREDIST"] : []], commandOptions);
  }
};
var GetCommand = class extends Command {
  static {
    __name(this, "GetCommand");
  }
  constructor(cmd, opts) {
    super(["get", ...cmd], opts);
  }
};
var GetBitCommand = class extends Command {
  static {
    __name(this, "GetBitCommand");
  }
  constructor(cmd, opts) {
    super(["getbit", ...cmd], opts);
  }
};
var GetDelCommand = class extends Command {
  static {
    __name(this, "GetDelCommand");
  }
  constructor(cmd, opts) {
    super(["getdel", ...cmd], opts);
  }
};
var GetExCommand = class extends Command {
  static {
    __name(this, "GetExCommand");
  }
  constructor([key, opts], cmdOpts) {
    const command = ["getex", key];
    if (opts) {
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("persist" in opts && opts.persist) {
        command.push("persist");
      }
    }
    super(command, cmdOpts);
  }
};
var GetRangeCommand = class extends Command {
  static {
    __name(this, "GetRangeCommand");
  }
  constructor(cmd, opts) {
    super(["getrange", ...cmd], opts);
  }
};
var GetSetCommand = class extends Command {
  static {
    __name(this, "GetSetCommand");
  }
  constructor(cmd, opts) {
    super(["getset", ...cmd], opts);
  }
};
var HDelCommand = class extends Command {
  static {
    __name(this, "HDelCommand");
  }
  constructor(cmd, opts) {
    super(["hdel", ...cmd], opts);
  }
};
var HExistsCommand = class extends Command {
  static {
    __name(this, "HExistsCommand");
  }
  constructor(cmd, opts) {
    super(["hexists", ...cmd], opts);
  }
};
var HExpireCommand = class extends Command {
  static {
    __name(this, "HExpireCommand");
  }
  constructor(cmd, opts) {
    const [key, fields, seconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpire",
        key,
        seconds,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HExpireAtCommand = class extends Command {
  static {
    __name(this, "HExpireAtCommand");
  }
  constructor(cmd, opts) {
    const [key, fields, timestamp, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpireat",
        key,
        timestamp,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HExpireTimeCommand = class extends Command {
  static {
    __name(this, "HExpireTimeCommand");
  }
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hexpiretime", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPersistCommand = class extends Command {
  static {
    __name(this, "HPersistCommand");
  }
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpersist", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPExpireCommand = class extends Command {
  static {
    __name(this, "HPExpireCommand");
  }
  constructor(cmd, opts) {
    const [key, fields, milliseconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hpexpire",
        key,
        milliseconds,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HPExpireAtCommand = class extends Command {
  static {
    __name(this, "HPExpireAtCommand");
  }
  constructor(cmd, opts) {
    const [key, fields, timestamp, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hpexpireat",
        key,
        timestamp,
        ...option ? [option] : [],
        "FIELDS",
        fieldArray.length,
        ...fieldArray
      ],
      opts
    );
  }
};
var HPExpireTimeCommand = class extends Command {
  static {
    __name(this, "HPExpireTimeCommand");
  }
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpexpiretime", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HPTtlCommand = class extends Command {
  static {
    __name(this, "HPTtlCommand");
  }
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpttl", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HGetCommand = class extends Command {
  static {
    __name(this, "HGetCommand");
  }
  constructor(cmd, opts) {
    super(["hget", ...cmd], opts);
  }
};
function deserialize4(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      const valueIsNumberAndNotSafeInteger = !Number.isNaN(Number(value)) && !Number.isSafeInteger(Number(value));
      obj[key] = valueIsNumberAndNotSafeInteger ? value : JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj;
}
__name(deserialize4, "deserialize4");
var HGetAllCommand = class extends Command {
  static {
    __name(this, "HGetAllCommand");
  }
  constructor(cmd, opts) {
    super(["hgetall", ...cmd], {
      deserialize: /* @__PURE__ */ __name((result) => deserialize4(result), "deserialize"),
      ...opts
    });
  }
};
function deserialize5(fields, result) {
  if (result.every((field) => field === null)) {
    return null;
  }
  const obj = {};
  for (const [i, field] of fields.entries()) {
    try {
      obj[field] = JSON.parse(result[i]);
    } catch {
      obj[field] = result[i];
    }
  }
  return obj;
}
__name(deserialize5, "deserialize5");
var HMGetCommand = class extends Command {
  static {
    __name(this, "HMGetCommand");
  }
  constructor([key, ...fields], opts) {
    super(["hmget", key, ...fields], {
      deserialize: /* @__PURE__ */ __name((result) => deserialize5(fields, result), "deserialize"),
      ...opts
    });
  }
};
var HGetDelCommand = class extends Command {
  static {
    __name(this, "HGetDelCommand");
  }
  constructor([key, ...fields], opts) {
    super(["hgetdel", key, "FIELDS", fields.length, ...fields], {
      deserialize: /* @__PURE__ */ __name((result) => deserialize5(fields.map(String), result), "deserialize"),
      ...opts
    });
  }
};
var HGetExCommand = class extends Command {
  static {
    __name(this, "HGetExCommand");
  }
  constructor([key, opts, ...fields], cmdOpts) {
    const command = ["hgetex", key];
    if ("ex" in opts && typeof opts.ex === "number") {
      command.push("EX", opts.ex);
    } else if ("px" in opts && typeof opts.px === "number") {
      command.push("PX", opts.px);
    } else if ("exat" in opts && typeof opts.exat === "number") {
      command.push("EXAT", opts.exat);
    } else if ("pxat" in opts && typeof opts.pxat === "number") {
      command.push("PXAT", opts.pxat);
    } else if ("persist" in opts && opts.persist) {
      command.push("PERSIST");
    }
    command.push("FIELDS", fields.length, ...fields);
    super(command, {
      deserialize: /* @__PURE__ */ __name((result) => deserialize5(fields.map(String), result), "deserialize"),
      ...cmdOpts
    });
  }
};
var HIncrByCommand = class extends Command {
  static {
    __name(this, "HIncrByCommand");
  }
  constructor(cmd, opts) {
    super(["hincrby", ...cmd], opts);
  }
};
var HIncrByFloatCommand = class extends Command {
  static {
    __name(this, "HIncrByFloatCommand");
  }
  constructor(cmd, opts) {
    super(["hincrbyfloat", ...cmd], opts);
  }
};
var HKeysCommand = class extends Command {
  static {
    __name(this, "HKeysCommand");
  }
  constructor([key], opts) {
    super(["hkeys", key], opts);
  }
};
var HLenCommand = class extends Command {
  static {
    __name(this, "HLenCommand");
  }
  constructor(cmd, opts) {
    super(["hlen", ...cmd], opts);
  }
};
var HMSetCommand = class extends Command {
  static {
    __name(this, "HMSetCommand");
  }
  constructor([key, kv], opts) {
    super(["hmset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
};
var HScanCommand = class extends Command {
  static {
    __name(this, "HScanCommand");
  }
  constructor([key, cursor, cmdOpts], opts) {
    const command = ["hscan", key, cursor];
    if (cmdOpts?.match) {
      command.push("match", cmdOpts.match);
    }
    if (typeof cmdOpts?.count === "number") {
      command.push("count", cmdOpts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...opts
    });
  }
};
var HSetCommand = class extends Command {
  static {
    __name(this, "HSetCommand");
  }
  constructor([key, kv], opts) {
    super(["hset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
};
var HSetExCommand = class extends Command {
  static {
    __name(this, "HSetExCommand");
  }
  constructor([key, opts, kv], cmdOpts) {
    const command = ["hsetex", key];
    if (opts.conditional) {
      command.push(opts.conditional.toUpperCase());
    }
    if (opts.expiration) {
      if ("ex" in opts.expiration && typeof opts.expiration.ex === "number") {
        command.push("EX", opts.expiration.ex);
      } else if ("px" in opts.expiration && typeof opts.expiration.px === "number") {
        command.push("PX", opts.expiration.px);
      } else if ("exat" in opts.expiration && typeof opts.expiration.exat === "number") {
        command.push("EXAT", opts.expiration.exat);
      } else if ("pxat" in opts.expiration && typeof opts.expiration.pxat === "number") {
        command.push("PXAT", opts.expiration.pxat);
      } else if ("keepttl" in opts.expiration && opts.expiration.keepttl) {
        command.push("KEEPTTL");
      }
    }
    const entries = Object.entries(kv);
    command.push("FIELDS", entries.length);
    for (const [field, value] of entries) {
      command.push(field, value);
    }
    super(command, cmdOpts);
  }
};
var HSetNXCommand = class extends Command {
  static {
    __name(this, "HSetNXCommand");
  }
  constructor(cmd, opts) {
    super(["hsetnx", ...cmd], opts);
  }
};
var HStrLenCommand = class extends Command {
  static {
    __name(this, "HStrLenCommand");
  }
  constructor(cmd, opts) {
    super(["hstrlen", ...cmd], opts);
  }
};
var HTtlCommand = class extends Command {
  static {
    __name(this, "HTtlCommand");
  }
  constructor(cmd, opts) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["httl", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
};
var HValsCommand = class extends Command {
  static {
    __name(this, "HValsCommand");
  }
  constructor(cmd, opts) {
    super(["hvals", ...cmd], opts);
  }
};
var IncrCommand = class extends Command {
  static {
    __name(this, "IncrCommand");
  }
  constructor(cmd, opts) {
    super(["incr", ...cmd], opts);
  }
};
var IncrByCommand = class extends Command {
  static {
    __name(this, "IncrByCommand");
  }
  constructor(cmd, opts) {
    super(["incrby", ...cmd], opts);
  }
};
var IncrByFloatCommand = class extends Command {
  static {
    __name(this, "IncrByFloatCommand");
  }
  constructor(cmd, opts) {
    super(["incrbyfloat", ...cmd], opts);
  }
};
var JsonArrAppendCommand = class extends Command {
  static {
    __name(this, "JsonArrAppendCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.ARRAPPEND", ...cmd], opts);
  }
};
var JsonArrIndexCommand = class extends Command {
  static {
    __name(this, "JsonArrIndexCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.ARRINDEX", ...cmd], opts);
  }
};
var JsonArrInsertCommand = class extends Command {
  static {
    __name(this, "JsonArrInsertCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.ARRINSERT", ...cmd], opts);
  }
};
var JsonArrLenCommand = class extends Command {
  static {
    __name(this, "JsonArrLenCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.ARRLEN", cmd[0], cmd[1] ?? "$"], opts);
  }
};
var JsonArrPopCommand = class extends Command {
  static {
    __name(this, "JsonArrPopCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.ARRPOP", ...cmd], opts);
  }
};
var JsonArrTrimCommand = class extends Command {
  static {
    __name(this, "JsonArrTrimCommand");
  }
  constructor(cmd, opts) {
    const path = cmd[1] ?? "$";
    const start = cmd[2] ?? 0;
    const stop = cmd[3] ?? 0;
    super(["JSON.ARRTRIM", cmd[0], path, start, stop], opts);
  }
};
var JsonClearCommand = class extends Command {
  static {
    __name(this, "JsonClearCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.CLEAR", ...cmd], opts);
  }
};
var JsonDelCommand = class extends Command {
  static {
    __name(this, "JsonDelCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.DEL", ...cmd], opts);
  }
};
var JsonForgetCommand = class extends Command {
  static {
    __name(this, "JsonForgetCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.FORGET", ...cmd], opts);
  }
};
var JsonGetCommand = class extends Command {
  static {
    __name(this, "JsonGetCommand");
  }
  constructor(cmd, opts) {
    const command = ["JSON.GET"];
    if (typeof cmd[1] === "string") {
      command.push(...cmd);
    } else {
      command.push(cmd[0]);
      if (cmd[1]) {
        if (cmd[1].indent) {
          command.push("INDENT", cmd[1].indent);
        }
        if (cmd[1].newline) {
          command.push("NEWLINE", cmd[1].newline);
        }
        if (cmd[1].space) {
          command.push("SPACE", cmd[1].space);
        }
      }
      command.push(...cmd.slice(2));
    }
    super(command, opts);
  }
};
var JsonMergeCommand = class extends Command {
  static {
    __name(this, "JsonMergeCommand");
  }
  constructor(cmd, opts) {
    const command = ["JSON.MERGE", ...cmd];
    super(command, opts);
  }
};
var JsonMGetCommand = class extends Command {
  static {
    __name(this, "JsonMGetCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.MGET", ...cmd[0], cmd[1]], opts);
  }
};
var JsonMSetCommand = class extends Command {
  static {
    __name(this, "JsonMSetCommand");
  }
  constructor(cmd, opts) {
    const command = ["JSON.MSET"];
    for (const c of cmd) {
      command.push(c.key, c.path, c.value);
    }
    super(command, opts);
  }
};
var JsonNumIncrByCommand = class extends Command {
  static {
    __name(this, "JsonNumIncrByCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.NUMINCRBY", ...cmd], opts);
  }
};
var JsonNumMultByCommand = class extends Command {
  static {
    __name(this, "JsonNumMultByCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.NUMMULTBY", ...cmd], opts);
  }
};
var JsonObjKeysCommand = class extends Command {
  static {
    __name(this, "JsonObjKeysCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.OBJKEYS", ...cmd], opts);
  }
};
var JsonObjLenCommand = class extends Command {
  static {
    __name(this, "JsonObjLenCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.OBJLEN", ...cmd], opts);
  }
};
var JsonRespCommand = class extends Command {
  static {
    __name(this, "JsonRespCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.RESP", ...cmd], opts);
  }
};
var JsonSetCommand = class extends Command {
  static {
    __name(this, "JsonSetCommand");
  }
  constructor(cmd, opts) {
    const command = ["JSON.SET", cmd[0], cmd[1], cmd[2]];
    if (cmd[3]) {
      if (cmd[3].nx) {
        command.push("NX");
      } else if (cmd[3].xx) {
        command.push("XX");
      }
    }
    super(command, opts);
  }
};
var JsonStrAppendCommand = class extends Command {
  static {
    __name(this, "JsonStrAppendCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.STRAPPEND", ...cmd], opts);
  }
};
var JsonStrLenCommand = class extends Command {
  static {
    __name(this, "JsonStrLenCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.STRLEN", ...cmd], opts);
  }
};
var JsonToggleCommand = class extends Command {
  static {
    __name(this, "JsonToggleCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.TOGGLE", ...cmd], opts);
  }
};
var JsonTypeCommand = class extends Command {
  static {
    __name(this, "JsonTypeCommand");
  }
  constructor(cmd, opts) {
    super(["JSON.TYPE", ...cmd], opts);
  }
};
var KeysCommand = class extends Command {
  static {
    __name(this, "KeysCommand");
  }
  constructor(cmd, opts) {
    super(["keys", ...cmd], opts);
  }
};
var LIndexCommand = class extends Command {
  static {
    __name(this, "LIndexCommand");
  }
  constructor(cmd, opts) {
    super(["lindex", ...cmd], opts);
  }
};
var LInsertCommand = class extends Command {
  static {
    __name(this, "LInsertCommand");
  }
  constructor(cmd, opts) {
    super(["linsert", ...cmd], opts);
  }
};
var LLenCommand = class extends Command {
  static {
    __name(this, "LLenCommand");
  }
  constructor(cmd, opts) {
    super(["llen", ...cmd], opts);
  }
};
var LMoveCommand = class extends Command {
  static {
    __name(this, "LMoveCommand");
  }
  constructor(cmd, opts) {
    super(["lmove", ...cmd], opts);
  }
};
var LmPopCommand = class extends Command {
  static {
    __name(this, "LmPopCommand");
  }
  constructor(cmd, opts) {
    const [numkeys, keys, direction, count3] = cmd;
    super(["LMPOP", numkeys, ...keys, direction, ...count3 ? ["COUNT", count3] : []], opts);
  }
};
var LPopCommand = class extends Command {
  static {
    __name(this, "LPopCommand");
  }
  constructor(cmd, opts) {
    super(["lpop", ...cmd], opts);
  }
};
var LPosCommand = class extends Command {
  static {
    __name(this, "LPosCommand");
  }
  constructor(cmd, opts) {
    const args = ["lpos", cmd[0], cmd[1]];
    if (typeof cmd[2]?.rank === "number") {
      args.push("rank", cmd[2].rank);
    }
    if (typeof cmd[2]?.count === "number") {
      args.push("count", cmd[2].count);
    }
    if (typeof cmd[2]?.maxLen === "number") {
      args.push("maxLen", cmd[2].maxLen);
    }
    super(args, opts);
  }
};
var LPushCommand = class extends Command {
  static {
    __name(this, "LPushCommand");
  }
  constructor(cmd, opts) {
    super(["lpush", ...cmd], opts);
  }
};
var LPushXCommand = class extends Command {
  static {
    __name(this, "LPushXCommand");
  }
  constructor(cmd, opts) {
    super(["lpushx", ...cmd], opts);
  }
};
var LRangeCommand = class extends Command {
  static {
    __name(this, "LRangeCommand");
  }
  constructor(cmd, opts) {
    super(["lrange", ...cmd], opts);
  }
};
var LRemCommand = class extends Command {
  static {
    __name(this, "LRemCommand");
  }
  constructor(cmd, opts) {
    super(["lrem", ...cmd], opts);
  }
};
var LSetCommand = class extends Command {
  static {
    __name(this, "LSetCommand");
  }
  constructor(cmd, opts) {
    super(["lset", ...cmd], opts);
  }
};
var LTrimCommand = class extends Command {
  static {
    __name(this, "LTrimCommand");
  }
  constructor(cmd, opts) {
    super(["ltrim", ...cmd], opts);
  }
};
var MGetCommand = class extends Command {
  static {
    __name(this, "MGetCommand");
  }
  constructor(cmd, opts) {
    const keys = Array.isArray(cmd[0]) ? cmd[0] : cmd;
    super(["mget", ...keys], opts);
  }
};
var MSetCommand = class extends Command {
  static {
    __name(this, "MSetCommand");
  }
  constructor([kv], opts) {
    super(["mset", ...Object.entries(kv).flatMap(([key, value]) => [key, value])], opts);
  }
};
var MSetNXCommand = class extends Command {
  static {
    __name(this, "MSetNXCommand");
  }
  constructor([kv], opts) {
    super(["msetnx", ...Object.entries(kv).flat()], opts);
  }
};
var PersistCommand = class extends Command {
  static {
    __name(this, "PersistCommand");
  }
  constructor(cmd, opts) {
    super(["persist", ...cmd], opts);
  }
};
var PExpireCommand = class extends Command {
  static {
    __name(this, "PExpireCommand");
  }
  constructor(cmd, opts) {
    super(["pexpire", ...cmd], opts);
  }
};
var PExpireAtCommand = class extends Command {
  static {
    __name(this, "PExpireAtCommand");
  }
  constructor(cmd, opts) {
    super(["pexpireat", ...cmd], opts);
  }
};
var PfAddCommand = class extends Command {
  static {
    __name(this, "PfAddCommand");
  }
  constructor(cmd, opts) {
    super(["pfadd", ...cmd], opts);
  }
};
var PfCountCommand = class extends Command {
  static {
    __name(this, "PfCountCommand");
  }
  constructor(cmd, opts) {
    super(["pfcount", ...cmd], opts);
  }
};
var PfMergeCommand = class extends Command {
  static {
    __name(this, "PfMergeCommand");
  }
  constructor(cmd, opts) {
    super(["pfmerge", ...cmd], opts);
  }
};
var PingCommand = class extends Command {
  static {
    __name(this, "PingCommand");
  }
  constructor(cmd, opts) {
    const command = ["ping"];
    if (cmd?.[0] !== void 0) {
      command.push(cmd[0]);
    }
    super(command, opts);
  }
};
var PSetEXCommand = class extends Command {
  static {
    __name(this, "PSetEXCommand");
  }
  constructor(cmd, opts) {
    super(["psetex", ...cmd], opts);
  }
};
var PTtlCommand = class extends Command {
  static {
    __name(this, "PTtlCommand");
  }
  constructor(cmd, opts) {
    super(["pttl", ...cmd], opts);
  }
};
var PublishCommand = class extends Command {
  static {
    __name(this, "PublishCommand");
  }
  constructor(cmd, opts) {
    super(["publish", ...cmd], opts);
  }
};
var RandomKeyCommand = class extends Command {
  static {
    __name(this, "RandomKeyCommand");
  }
  constructor(opts) {
    super(["randomkey"], opts);
  }
};
var RenameCommand = class extends Command {
  static {
    __name(this, "RenameCommand");
  }
  constructor(cmd, opts) {
    super(["rename", ...cmd], opts);
  }
};
var RenameNXCommand = class extends Command {
  static {
    __name(this, "RenameNXCommand");
  }
  constructor(cmd, opts) {
    super(["renamenx", ...cmd], opts);
  }
};
var RPopCommand = class extends Command {
  static {
    __name(this, "RPopCommand");
  }
  constructor(cmd, opts) {
    super(["rpop", ...cmd], opts);
  }
};
var RPushCommand = class extends Command {
  static {
    __name(this, "RPushCommand");
  }
  constructor(cmd, opts) {
    super(["rpush", ...cmd], opts);
  }
};
var RPushXCommand = class extends Command {
  static {
    __name(this, "RPushXCommand");
  }
  constructor(cmd, opts) {
    super(["rpushx", ...cmd], opts);
  }
};
var SAddCommand = class extends Command {
  static {
    __name(this, "SAddCommand");
  }
  constructor(cmd, opts) {
    super(["sadd", ...cmd], opts);
  }
};
var ScanCommand = class extends Command {
  static {
    __name(this, "ScanCommand");
  }
  constructor([cursor, opts], cmdOpts) {
    const command = ["scan", cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    if (opts && "withType" in opts && opts.withType === true) {
      command.push("withtype");
    } else if (opts && "type" in opts && opts.type && opts.type.length > 0) {
      command.push("type", opts.type);
    }
    super(command, {
      // @ts-expect-error ignore types here
      deserialize: opts?.withType ? deserializeScanWithTypesResponse : deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var SCardCommand = class extends Command {
  static {
    __name(this, "SCardCommand");
  }
  constructor(cmd, opts) {
    super(["scard", ...cmd], opts);
  }
};
var ScriptExistsCommand = class extends Command {
  static {
    __name(this, "ScriptExistsCommand");
  }
  constructor(hashes, opts) {
    super(["script", "exists", ...hashes], {
      deserialize: /* @__PURE__ */ __name((result) => result, "deserialize"),
      ...opts
    });
  }
};
var ScriptFlushCommand = class extends Command {
  static {
    __name(this, "ScriptFlushCommand");
  }
  constructor([opts], cmdOpts) {
    const cmd = ["script", "flush"];
    if (opts?.sync) {
      cmd.push("sync");
    } else if (opts?.async) {
      cmd.push("async");
    }
    super(cmd, cmdOpts);
  }
};
var ScriptLoadCommand = class extends Command {
  static {
    __name(this, "ScriptLoadCommand");
  }
  constructor(args, opts) {
    super(["script", "load", ...args], opts);
  }
};
var SDiffCommand = class extends Command {
  static {
    __name(this, "SDiffCommand");
  }
  constructor(cmd, opts) {
    super(["sdiff", ...cmd], opts);
  }
};
var SDiffStoreCommand = class extends Command {
  static {
    __name(this, "SDiffStoreCommand");
  }
  constructor(cmd, opts) {
    super(["sdiffstore", ...cmd], opts);
  }
};
var SetCommand = class extends Command {
  static {
    __name(this, "SetCommand");
  }
  constructor([key, value, opts], cmdOpts) {
    const command = ["set", key, value];
    if (opts) {
      if ("nx" in opts && opts.nx) {
        command.push("nx");
      } else if ("xx" in opts && opts.xx) {
        command.push("xx");
      }
      if ("get" in opts && opts.get) {
        command.push("get");
      }
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("keepTtl" in opts && opts.keepTtl) {
        command.push("keepTtl");
      }
    }
    super(command, cmdOpts);
  }
};
var SetBitCommand = class extends Command {
  static {
    __name(this, "SetBitCommand");
  }
  constructor(cmd, opts) {
    super(["setbit", ...cmd], opts);
  }
};
var SetExCommand = class extends Command {
  static {
    __name(this, "SetExCommand");
  }
  constructor(cmd, opts) {
    super(["setex", ...cmd], opts);
  }
};
var SetNxCommand = class extends Command {
  static {
    __name(this, "SetNxCommand");
  }
  constructor(cmd, opts) {
    super(["setnx", ...cmd], opts);
  }
};
var SetRangeCommand = class extends Command {
  static {
    __name(this, "SetRangeCommand");
  }
  constructor(cmd, opts) {
    super(["setrange", ...cmd], opts);
  }
};
var SInterCommand = class extends Command {
  static {
    __name(this, "SInterCommand");
  }
  constructor(cmd, opts) {
    super(["sinter", ...cmd], opts);
  }
};
var SInterCardCommand = class extends Command {
  static {
    __name(this, "SInterCardCommand");
  }
  constructor(cmd, cmdOpts) {
    const [keys, opts] = cmd;
    const command = ["sintercard", keys.length, ...keys];
    if (opts?.limit !== void 0) {
      command.push("LIMIT", opts.limit);
    }
    super(command, cmdOpts);
  }
};
var SInterStoreCommand = class extends Command {
  static {
    __name(this, "SInterStoreCommand");
  }
  constructor(cmd, opts) {
    super(["sinterstore", ...cmd], opts);
  }
};
var SIsMemberCommand = class extends Command {
  static {
    __name(this, "SIsMemberCommand");
  }
  constructor(cmd, opts) {
    super(["sismember", ...cmd], opts);
  }
};
var SMembersCommand = class extends Command {
  static {
    __name(this, "SMembersCommand");
  }
  constructor(cmd, opts) {
    super(["smembers", ...cmd], opts);
  }
};
var SMIsMemberCommand = class extends Command {
  static {
    __name(this, "SMIsMemberCommand");
  }
  constructor(cmd, opts) {
    super(["smismember", cmd[0], ...cmd[1]], opts);
  }
};
var SMoveCommand = class extends Command {
  static {
    __name(this, "SMoveCommand");
  }
  constructor(cmd, opts) {
    super(["smove", ...cmd], opts);
  }
};
var SPopCommand = class extends Command {
  static {
    __name(this, "SPopCommand");
  }
  constructor([key, count3], opts) {
    const command = ["spop", key];
    if (typeof count3 === "number") {
      command.push(count3);
    }
    super(command, opts);
  }
};
var SRandMemberCommand = class extends Command {
  static {
    __name(this, "SRandMemberCommand");
  }
  constructor([key, count3], opts) {
    const command = ["srandmember", key];
    if (typeof count3 === "number") {
      command.push(count3);
    }
    super(command, opts);
  }
};
var SRemCommand = class extends Command {
  static {
    __name(this, "SRemCommand");
  }
  constructor(cmd, opts) {
    super(["srem", ...cmd], opts);
  }
};
var SScanCommand = class extends Command {
  static {
    __name(this, "SScanCommand");
  }
  constructor([key, cursor, opts], cmdOpts) {
    const command = ["sscan", key, cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var StrLenCommand = class extends Command {
  static {
    __name(this, "StrLenCommand");
  }
  constructor(cmd, opts) {
    super(["strlen", ...cmd], opts);
  }
};
var SUnionCommand = class extends Command {
  static {
    __name(this, "SUnionCommand");
  }
  constructor(cmd, opts) {
    super(["sunion", ...cmd], opts);
  }
};
var SUnionStoreCommand = class extends Command {
  static {
    __name(this, "SUnionStoreCommand");
  }
  constructor(cmd, opts) {
    super(["sunionstore", ...cmd], opts);
  }
};
var TimeCommand = class extends Command {
  static {
    __name(this, "TimeCommand");
  }
  constructor(opts) {
    super(["time"], opts);
  }
};
var TouchCommand = class extends Command {
  static {
    __name(this, "TouchCommand");
  }
  constructor(cmd, opts) {
    super(["touch", ...cmd], opts);
  }
};
var TtlCommand = class extends Command {
  static {
    __name(this, "TtlCommand");
  }
  constructor(cmd, opts) {
    super(["ttl", ...cmd], opts);
  }
};
var TypeCommand = class extends Command {
  static {
    __name(this, "TypeCommand");
  }
  constructor(cmd, opts) {
    super(["type", ...cmd], opts);
  }
};
var UnlinkCommand = class extends Command {
  static {
    __name(this, "UnlinkCommand");
  }
  constructor(cmd, opts) {
    super(["unlink", ...cmd], opts);
  }
};
var XAckCommand = class extends Command {
  static {
    __name(this, "XAckCommand");
  }
  constructor([key, group3, id], opts) {
    const ids = Array.isArray(id) ? [...id] : [id];
    super(["XACK", key, group3, ...ids], opts);
  }
};
var XAckDelCommand = class extends Command {
  static {
    __name(this, "XAckDelCommand");
  }
  constructor([key, group3, opts, ...ids], cmdOpts) {
    const command = ["XACKDEL", key, group3];
    command.push(opts.toUpperCase(), "IDS", ids.length, ...ids);
    super(command, cmdOpts);
  }
};
var XAddCommand = class extends Command {
  static {
    __name(this, "XAddCommand");
  }
  constructor([key, id, entries, opts], commandOptions) {
    const command = ["XADD", key];
    if (opts) {
      if (opts.nomkStream) {
        command.push("NOMKSTREAM");
      }
      if (opts.trim) {
        command.push(opts.trim.type, opts.trim.comparison, opts.trim.threshold);
        if (opts.trim.limit !== void 0) {
          command.push("LIMIT", opts.trim.limit);
        }
      }
    }
    command.push(id);
    for (const [k, v] of Object.entries(entries)) {
      command.push(k, v);
    }
    super(command, commandOptions);
  }
};
var XAutoClaim = class extends Command {
  static {
    __name(this, "XAutoClaim");
  }
  constructor([key, group3, consumer, minIdleTime, start, options], opts) {
    const commands = [];
    if (options?.count) {
      commands.push("COUNT", options.count);
    }
    if (options?.justId) {
      commands.push("JUSTID");
    }
    super(["XAUTOCLAIM", key, group3, consumer, minIdleTime, start, ...commands], opts);
  }
};
var XClaimCommand = class extends Command {
  static {
    __name(this, "XClaimCommand");
  }
  constructor([key, group3, consumer, minIdleTime, id, options], opts) {
    const ids = Array.isArray(id) ? [...id] : [id];
    const commands = [];
    if (options?.idleMS) {
      commands.push("IDLE", options.idleMS);
    }
    if (options?.idleMS) {
      commands.push("TIME", options.timeMS);
    }
    if (options?.retryCount) {
      commands.push("RETRYCOUNT", options.retryCount);
    }
    if (options?.force) {
      commands.push("FORCE");
    }
    if (options?.justId) {
      commands.push("JUSTID");
    }
    if (options?.lastId) {
      commands.push("LASTID", options.lastId);
    }
    super(["XCLAIM", key, group3, consumer, minIdleTime, ...ids, ...commands], opts);
  }
};
var XDelCommand = class extends Command {
  static {
    __name(this, "XDelCommand");
  }
  constructor([key, ids], opts) {
    const cmds = Array.isArray(ids) ? [...ids] : [ids];
    super(["XDEL", key, ...cmds], opts);
  }
};
var XDelExCommand = class extends Command {
  static {
    __name(this, "XDelExCommand");
  }
  constructor([key, opts, ...ids], cmdOpts) {
    const command = ["XDELEX", key];
    if (opts) {
      command.push(opts.toUpperCase());
    }
    command.push("IDS", ids.length, ...ids);
    super(command, cmdOpts);
  }
};
var XGroupCommand = class extends Command {
  static {
    __name(this, "XGroupCommand");
  }
  constructor([key, opts], commandOptions) {
    const command = ["XGROUP"];
    switch (opts.type) {
      case "CREATE": {
        command.push("CREATE", key, opts.group, opts.id);
        if (opts.options) {
          if (opts.options.MKSTREAM) {
            command.push("MKSTREAM");
          }
          if (opts.options.ENTRIESREAD !== void 0) {
            command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
          }
        }
        break;
      }
      case "CREATECONSUMER": {
        command.push("CREATECONSUMER", key, opts.group, opts.consumer);
        break;
      }
      case "DELCONSUMER": {
        command.push("DELCONSUMER", key, opts.group, opts.consumer);
        break;
      }
      case "DESTROY": {
        command.push("DESTROY", key, opts.group);
        break;
      }
      case "SETID": {
        command.push("SETID", key, opts.group, opts.id);
        if (opts.options?.ENTRIESREAD !== void 0) {
          command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
        }
        break;
      }
      default: {
        throw new Error("Invalid XGROUP");
      }
    }
    super(command, commandOptions);
  }
};
var XInfoCommand = class extends Command {
  static {
    __name(this, "XInfoCommand");
  }
  constructor([key, options], opts) {
    const cmds = [];
    if (options.type === "CONSUMERS") {
      cmds.push("CONSUMERS", key, options.group);
    } else {
      cmds.push("GROUPS", key);
    }
    super(["XINFO", ...cmds], opts);
  }
};
var XLenCommand = class extends Command {
  static {
    __name(this, "XLenCommand");
  }
  constructor(cmd, opts) {
    super(["XLEN", ...cmd], opts);
  }
};
var XPendingCommand = class extends Command {
  static {
    __name(this, "XPendingCommand");
  }
  constructor([key, group3, start, end, count3, options], opts) {
    const consumers = options?.consumer === void 0 ? [] : Array.isArray(options.consumer) ? [...options.consumer] : [options.consumer];
    super(
      [
        "XPENDING",
        key,
        group3,
        ...options?.idleTime ? ["IDLE", options.idleTime] : [],
        start,
        end,
        count3,
        ...consumers
      ],
      opts
    );
  }
};
function deserialize6(result) {
  const obj = {};
  for (const e of result) {
    for (let i = 0; i < e.length; i += 2) {
      const streamId = e[i];
      const entries = e[i + 1];
      if (!(streamId in obj)) {
        obj[streamId] = {};
      }
      for (let j = 0; j < entries.length; j += 2) {
        const field = entries[j];
        const value = entries[j + 1];
        try {
          obj[streamId][field] = JSON.parse(value);
        } catch {
          obj[streamId][field] = value;
        }
      }
    }
  }
  return obj;
}
__name(deserialize6, "deserialize6");
var XRangeCommand = class extends Command {
  static {
    __name(this, "XRangeCommand");
  }
  constructor([key, start, end, count3], opts) {
    const command = ["XRANGE", key, start, end];
    if (typeof count3 === "number") {
      command.push("COUNT", count3);
    }
    super(command, {
      deserialize: /* @__PURE__ */ __name((result) => deserialize6(result), "deserialize"),
      ...opts
    });
  }
};
var UNBALANCED_XREAD_ERR = "ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified";
var XReadCommand = class extends Command {
  static {
    __name(this, "XReadCommand");
  }
  constructor([key, id, options], opts) {
    if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
      throw new Error(UNBALANCED_XREAD_ERR);
    }
    const commands = [];
    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }
    commands.push(
      "STREAMS",
      ...Array.isArray(key) ? [...key] : [key],
      ...Array.isArray(id) ? [...id] : [id]
    );
    super(["XREAD", ...commands], opts);
  }
};
var UNBALANCED_XREADGROUP_ERR = "ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified";
var XReadGroupCommand = class extends Command {
  static {
    __name(this, "XReadGroupCommand");
  }
  constructor([group3, consumer, key, id, options], opts) {
    if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
      throw new Error(UNBALANCED_XREADGROUP_ERR);
    }
    const commands = [];
    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }
    if (typeof options?.NOACK === "boolean" && options.NOACK) {
      commands.push("NOACK");
    }
    commands.push(
      "STREAMS",
      ...Array.isArray(key) ? [...key] : [key],
      ...Array.isArray(id) ? [...id] : [id]
    );
    super(["XREADGROUP", "GROUP", group3, consumer, ...commands], opts);
  }
};
var XRevRangeCommand = class extends Command {
  static {
    __name(this, "XRevRangeCommand");
  }
  constructor([key, end, start, count3], opts) {
    const command = ["XREVRANGE", key, end, start];
    if (typeof count3 === "number") {
      command.push("COUNT", count3);
    }
    super(command, {
      deserialize: /* @__PURE__ */ __name((result) => deserialize7(result), "deserialize"),
      ...opts
    });
  }
};
function deserialize7(result) {
  const obj = {};
  for (const e of result) {
    for (let i = 0; i < e.length; i += 2) {
      const streamId = e[i];
      const entries = e[i + 1];
      if (!(streamId in obj)) {
        obj[streamId] = {};
      }
      for (let j = 0; j < entries.length; j += 2) {
        const field = entries[j];
        const value = entries[j + 1];
        try {
          obj[streamId][field] = JSON.parse(value);
        } catch {
          obj[streamId][field] = value;
        }
      }
    }
  }
  return obj;
}
__name(deserialize7, "deserialize7");
var XTrimCommand = class extends Command {
  static {
    __name(this, "XTrimCommand");
  }
  constructor([key, options], opts) {
    const { limit, strategy, threshold, exactness = "~" } = options;
    super(["XTRIM", key, strategy, exactness, threshold, ...limit ? ["LIMIT", limit] : []], opts);
  }
};
var ZAddCommand = class extends Command {
  static {
    __name(this, "ZAddCommand");
  }
  constructor([key, arg1, ...arg2], opts) {
    const command = ["zadd", key];
    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }
    if ("incr" in arg1 && arg1.incr) {
      command.push("incr");
    }
    if ("lt" in arg1 && arg1.lt) {
      command.push("lt");
    } else if ("gt" in arg1 && arg1.gt) {
      command.push("gt");
    }
    if ("score" in arg1 && "member" in arg1) {
      command.push(arg1.score, arg1.member);
    }
    command.push(...arg2.flatMap(({ score, member }) => [score, member]));
    super(command, opts);
  }
};
var ZCardCommand = class extends Command {
  static {
    __name(this, "ZCardCommand");
  }
  constructor(cmd, opts) {
    super(["zcard", ...cmd], opts);
  }
};
var ZCountCommand = class extends Command {
  static {
    __name(this, "ZCountCommand");
  }
  constructor(cmd, opts) {
    super(["zcount", ...cmd], opts);
  }
};
var ZIncrByCommand = class extends Command {
  static {
    __name(this, "ZIncrByCommand");
  }
  constructor(cmd, opts) {
    super(["zincrby", ...cmd], opts);
  }
};
var ZInterStoreCommand = class extends Command {
  static {
    __name(this, "ZInterStoreCommand");
  }
  constructor([destination, numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zinterstore", destination, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
    }
    super(command, cmdOpts);
  }
};
var ZLexCountCommand = class extends Command {
  static {
    __name(this, "ZLexCountCommand");
  }
  constructor(cmd, opts) {
    super(["zlexcount", ...cmd], opts);
  }
};
var ZPopMaxCommand = class extends Command {
  static {
    __name(this, "ZPopMaxCommand");
  }
  constructor([key, count3], opts) {
    const command = ["zpopmax", key];
    if (typeof count3 === "number") {
      command.push(count3);
    }
    super(command, opts);
  }
};
var ZPopMinCommand = class extends Command {
  static {
    __name(this, "ZPopMinCommand");
  }
  constructor([key, count3], opts) {
    const command = ["zpopmin", key];
    if (typeof count3 === "number") {
      command.push(count3);
    }
    super(command, opts);
  }
};
var ZRangeCommand = class extends Command {
  static {
    __name(this, "ZRangeCommand");
  }
  constructor([key, min, max, opts], cmdOpts) {
    const command = ["zrange", key, min, max];
    if (opts?.byScore) {
      command.push("byscore");
    }
    if (opts?.byLex) {
      command.push("bylex");
    }
    if (opts?.rev) {
      command.push("rev");
    }
    if (opts?.count !== void 0 && opts.offset !== void 0) {
      command.push("limit", opts.offset, opts.count);
    }
    if (opts?.withScores) {
      command.push("withscores");
    }
    super(command, cmdOpts);
  }
};
var ZRankCommand = class extends Command {
  static {
    __name(this, "ZRankCommand");
  }
  constructor(cmd, opts) {
    super(["zrank", ...cmd], opts);
  }
};
var ZRemCommand = class extends Command {
  static {
    __name(this, "ZRemCommand");
  }
  constructor(cmd, opts) {
    super(["zrem", ...cmd], opts);
  }
};
var ZRemRangeByLexCommand = class extends Command {
  static {
    __name(this, "ZRemRangeByLexCommand");
  }
  constructor(cmd, opts) {
    super(["zremrangebylex", ...cmd], opts);
  }
};
var ZRemRangeByRankCommand = class extends Command {
  static {
    __name(this, "ZRemRangeByRankCommand");
  }
  constructor(cmd, opts) {
    super(["zremrangebyrank", ...cmd], opts);
  }
};
var ZRemRangeByScoreCommand = class extends Command {
  static {
    __name(this, "ZRemRangeByScoreCommand");
  }
  constructor(cmd, opts) {
    super(["zremrangebyscore", ...cmd], opts);
  }
};
var ZRevRankCommand = class extends Command {
  static {
    __name(this, "ZRevRankCommand");
  }
  constructor(cmd, opts) {
    super(["zrevrank", ...cmd], opts);
  }
};
var ZScanCommand = class extends Command {
  static {
    __name(this, "ZScanCommand");
  }
  constructor([key, cursor, opts], cmdOpts) {
    const command = ["zscan", key, cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts
    });
  }
};
var ZScoreCommand = class extends Command {
  static {
    __name(this, "ZScoreCommand");
  }
  constructor(cmd, opts) {
    super(["zscore", ...cmd], opts);
  }
};
var ZUnionCommand = class extends Command {
  static {
    __name(this, "ZUnionCommand");
  }
  constructor([numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zunion", numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
      if (opts.withScores) {
        command.push("withscores");
      }
    }
    super(command, cmdOpts);
  }
};
var ZUnionStoreCommand = class extends Command {
  static {
    __name(this, "ZUnionStoreCommand");
  }
  constructor([destination, numKeys, keyOrKeys, opts], cmdOpts) {
    const command = ["zunionstore", destination, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
    }
    super(command, cmdOpts);
  }
};
var ZDiffStoreCommand = class extends Command {
  static {
    __name(this, "ZDiffStoreCommand");
  }
  constructor(cmd, opts) {
    super(["zdiffstore", ...cmd], opts);
  }
};
var ZMScoreCommand = class extends Command {
  static {
    __name(this, "ZMScoreCommand");
  }
  constructor(cmd, opts) {
    const [key, members] = cmd;
    super(["zmscore", key, ...members], opts);
  }
};
var Pipeline = class {
  static {
    __name(this, "Pipeline");
  }
  client;
  commands;
  commandOptions;
  multiExec;
  constructor(opts) {
    this.client = opts.client;
    this.commands = [];
    this.commandOptions = opts.commandOptions;
    this.multiExec = opts.multiExec ?? false;
    if (this.commandOptions?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async (options) => {
        const start = performance.now();
        const result = await (options ? originalExec(options) : originalExec());
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        console.log(
          `Latency for \x1B[38;2;19;185;39m${this.multiExec ? ["MULTI-EXEC"] : ["PIPELINE"].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${loggerResult} ms\x1B[0m`
        );
        return result;
      };
    }
  }
  exec = /* @__PURE__ */ __name(async (options) => {
    if (this.commands.length === 0) {
      throw new Error("Pipeline is empty");
    }
    const path = this.multiExec ? ["multi-exec"] : ["pipeline"];
    const res = await this.client.request({
      path,
      body: Object.values(this.commands).map((c) => c.command)
    });
    return options?.keepErrors ? res.map(({ error: error3, result }, i) => {
      return {
        error: error3,
        result: this.commands[i].deserialize(result)
      };
    }) : res.map(({ error: error3, result }, i) => {
      if (error3) {
        throw new UpstashError(
          `Command ${i + 1} [ ${this.commands[i].command[0]} ] failed: ${error3}`
        );
      }
      return this.commands[i].deserialize(result);
    });
  }, "exec");
  /**
   * Returns the length of pipeline before the execution
   */
  length() {
    return this.commands.length;
  }
  /**
   * Pushes a command into the pipeline and returns a chainable instance of the
   * pipeline
   */
  chain(command) {
    this.commands.push(command);
    return this;
  }
  /**
   * @see https://redis.io/commands/append
   */
  append = /* @__PURE__ */ __name((...args) => this.chain(new AppendCommand(args, this.commandOptions)), "append");
  /**
   * @see https://redis.io/commands/bitcount
   */
  bitcount = /* @__PURE__ */ __name((...args) => this.chain(new BitCountCommand(args, this.commandOptions)), "bitcount");
  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.pipeline()
   *   .bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [[0, 1]]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = /* @__PURE__ */ __name((...args) => new BitFieldCommand(args, this.client, this.commandOptions, this.chain.bind(this)), "bitfield");
  /**
   * @see https://redis.io/commands/bitop
   */
  bitop = /* @__PURE__ */ __name((op, destinationKey, sourceKey, ...sourceKeys) => this.chain(
    new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.commandOptions)
  ), "bitop");
  /**
   * @see https://redis.io/commands/bitpos
   */
  bitpos = /* @__PURE__ */ __name((...args) => this.chain(new BitPosCommand(args, this.commandOptions)), "bitpos");
  /**
   * @see https://redis.io/commands/client-setinfo
   */
  clientSetinfo = /* @__PURE__ */ __name((...args) => this.chain(new ClientSetInfoCommand(args, this.commandOptions)), "clientSetinfo");
  /**
   * @see https://redis.io/commands/copy
   */
  copy = /* @__PURE__ */ __name((...args) => this.chain(new CopyCommand(args, this.commandOptions)), "copy");
  /**
   * @see https://redis.io/commands/zdiffstore
   */
  zdiffstore = /* @__PURE__ */ __name((...args) => this.chain(new ZDiffStoreCommand(args, this.commandOptions)), "zdiffstore");
  /**
   * @see https://redis.io/commands/dbsize
   */
  dbsize = /* @__PURE__ */ __name(() => this.chain(new DBSizeCommand(this.commandOptions)), "dbsize");
  /**
   * @see https://redis.io/commands/decr
   */
  decr = /* @__PURE__ */ __name((...args) => this.chain(new DecrCommand(args, this.commandOptions)), "decr");
  /**
   * @see https://redis.io/commands/decrby
   */
  decrby = /* @__PURE__ */ __name((...args) => this.chain(new DecrByCommand(args, this.commandOptions)), "decrby");
  /**
   * @see https://redis.io/commands/del
   */
  del = /* @__PURE__ */ __name((...args) => this.chain(new DelCommand(args, this.commandOptions)), "del");
  /**
   * @see https://redis.io/commands/echo
   */
  echo = /* @__PURE__ */ __name((...args) => this.chain(new EchoCommand(args, this.commandOptions)), "echo");
  /**
   * @see https://redis.io/commands/eval_ro
   */
  evalRo = /* @__PURE__ */ __name((...args) => this.chain(new EvalROCommand(args, this.commandOptions)), "evalRo");
  /**
   * @see https://redis.io/commands/eval
   */
  eval = /* @__PURE__ */ __name((...args) => this.chain(new EvalCommand(args, this.commandOptions)), "eval");
  /**
   * @see https://redis.io/commands/evalsha_ro
   */
  evalshaRo = /* @__PURE__ */ __name((...args) => this.chain(new EvalshaROCommand(args, this.commandOptions)), "evalshaRo");
  /**
   * @see https://redis.io/commands/evalsha
   */
  evalsha = /* @__PURE__ */ __name((...args) => this.chain(new EvalshaCommand(args, this.commandOptions)), "evalsha");
  /**
   * @see https://redis.io/commands/exists
   */
  exists = /* @__PURE__ */ __name((...args) => this.chain(new ExistsCommand(args, this.commandOptions)), "exists");
  /**
   * @see https://redis.io/commands/expire
   */
  expire = /* @__PURE__ */ __name((...args) => this.chain(new ExpireCommand(args, this.commandOptions)), "expire");
  /**
   * @see https://redis.io/commands/expireat
   */
  expireat = /* @__PURE__ */ __name((...args) => this.chain(new ExpireAtCommand(args, this.commandOptions)), "expireat");
  /**
   * @see https://redis.io/commands/flushall
   */
  flushall = /* @__PURE__ */ __name((args) => this.chain(new FlushAllCommand(args, this.commandOptions)), "flushall");
  /**
   * @see https://redis.io/commands/flushdb
   */
  flushdb = /* @__PURE__ */ __name((...args) => this.chain(new FlushDBCommand(args, this.commandOptions)), "flushdb");
  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = /* @__PURE__ */ __name((...args) => this.chain(new GeoAddCommand(args, this.commandOptions)), "geoadd");
  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = /* @__PURE__ */ __name((...args) => this.chain(new GeoDistCommand(args, this.commandOptions)), "geodist");
  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = /* @__PURE__ */ __name((...args) => this.chain(new GeoPosCommand(args, this.commandOptions)), "geopos");
  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = /* @__PURE__ */ __name((...args) => this.chain(new GeoHashCommand(args, this.commandOptions)), "geohash");
  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = /* @__PURE__ */ __name((...args) => this.chain(new GeoSearchCommand(args, this.commandOptions)), "geosearch");
  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = /* @__PURE__ */ __name((...args) => this.chain(new GeoSearchStoreCommand(args, this.commandOptions)), "geosearchstore");
  /**
   * @see https://redis.io/commands/get
   */
  get = /* @__PURE__ */ __name((...args) => this.chain(new GetCommand(args, this.commandOptions)), "get");
  /**
   * @see https://redis.io/commands/getbit
   */
  getbit = /* @__PURE__ */ __name((...args) => this.chain(new GetBitCommand(args, this.commandOptions)), "getbit");
  /**
   * @see https://redis.io/commands/getdel
   */
  getdel = /* @__PURE__ */ __name((...args) => this.chain(new GetDelCommand(args, this.commandOptions)), "getdel");
  /**
   * @see https://redis.io/commands/getex
   */
  getex = /* @__PURE__ */ __name((...args) => this.chain(new GetExCommand(args, this.commandOptions)), "getex");
  /**
   * @see https://redis.io/commands/getrange
   */
  getrange = /* @__PURE__ */ __name((...args) => this.chain(new GetRangeCommand(args, this.commandOptions)), "getrange");
  /**
   * @see https://redis.io/commands/getset
   */
  getset = /* @__PURE__ */ __name((key, value) => this.chain(new GetSetCommand([key, value], this.commandOptions)), "getset");
  /**
   * @see https://redis.io/commands/hdel
   */
  hdel = /* @__PURE__ */ __name((...args) => this.chain(new HDelCommand(args, this.commandOptions)), "hdel");
  /**
   * @see https://redis.io/commands/hexists
   */
  hexists = /* @__PURE__ */ __name((...args) => this.chain(new HExistsCommand(args, this.commandOptions)), "hexists");
  /**
   * @see https://redis.io/commands/hexpire
   */
  hexpire = /* @__PURE__ */ __name((...args) => this.chain(new HExpireCommand(args, this.commandOptions)), "hexpire");
  /**
   * @see https://redis.io/commands/hexpireat
   */
  hexpireat = /* @__PURE__ */ __name((...args) => this.chain(new HExpireAtCommand(args, this.commandOptions)), "hexpireat");
  /**
   * @see https://redis.io/commands/hexpiretime
   */
  hexpiretime = /* @__PURE__ */ __name((...args) => this.chain(new HExpireTimeCommand(args, this.commandOptions)), "hexpiretime");
  /**
   * @see https://redis.io/commands/httl
   */
  httl = /* @__PURE__ */ __name((...args) => this.chain(new HTtlCommand(args, this.commandOptions)), "httl");
  /**
   * @see https://redis.io/commands/hpexpire
   */
  hpexpire = /* @__PURE__ */ __name((...args) => this.chain(new HPExpireCommand(args, this.commandOptions)), "hpexpire");
  /**
   * @see https://redis.io/commands/hpexpireat
   */
  hpexpireat = /* @__PURE__ */ __name((...args) => this.chain(new HPExpireAtCommand(args, this.commandOptions)), "hpexpireat");
  /**
   * @see https://redis.io/commands/hpexpiretime
   */
  hpexpiretime = /* @__PURE__ */ __name((...args) => this.chain(new HPExpireTimeCommand(args, this.commandOptions)), "hpexpiretime");
  /**
   * @see https://redis.io/commands/hpttl
   */
  hpttl = /* @__PURE__ */ __name((...args) => this.chain(new HPTtlCommand(args, this.commandOptions)), "hpttl");
  /**
   * @see https://redis.io/commands/hpersist
   */
  hpersist = /* @__PURE__ */ __name((...args) => this.chain(new HPersistCommand(args, this.commandOptions)), "hpersist");
  /**
   * @see https://redis.io/commands/hget
   */
  hget = /* @__PURE__ */ __name((...args) => this.chain(new HGetCommand(args, this.commandOptions)), "hget");
  /**
   * @see https://redis.io/commands/hgetall
   */
  hgetall = /* @__PURE__ */ __name((...args) => this.chain(new HGetAllCommand(args, this.commandOptions)), "hgetall");
  /**
   * @see https://redis.io/commands/hgetdel
   */
  hgetdel = /* @__PURE__ */ __name((...args) => this.chain(new HGetDelCommand(args, this.commandOptions)), "hgetdel");
  /**
   * @see https://redis.io/commands/hgetex
   */
  hgetex = /* @__PURE__ */ __name((...args) => this.chain(new HGetExCommand(args, this.commandOptions)), "hgetex");
  /**
   * @see https://redis.io/commands/hincrby
   */
  hincrby = /* @__PURE__ */ __name((...args) => this.chain(new HIncrByCommand(args, this.commandOptions)), "hincrby");
  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  hincrbyfloat = /* @__PURE__ */ __name((...args) => this.chain(new HIncrByFloatCommand(args, this.commandOptions)), "hincrbyfloat");
  /**
   * @see https://redis.io/commands/hkeys
   */
  hkeys = /* @__PURE__ */ __name((...args) => this.chain(new HKeysCommand(args, this.commandOptions)), "hkeys");
  /**
   * @see https://redis.io/commands/hlen
   */
  hlen = /* @__PURE__ */ __name((...args) => this.chain(new HLenCommand(args, this.commandOptions)), "hlen");
  /**
   * @see https://redis.io/commands/hmget
   */
  hmget = /* @__PURE__ */ __name((...args) => this.chain(new HMGetCommand(args, this.commandOptions)), "hmget");
  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = /* @__PURE__ */ __name((key, kv) => this.chain(new HMSetCommand([key, kv], this.commandOptions)), "hmset");
  /**
   * @see https://redis.io/commands/hrandfield
   */
  hrandfield = /* @__PURE__ */ __name((key, count3, withValues) => this.chain(new HRandFieldCommand([key, count3, withValues], this.commandOptions)), "hrandfield");
  /**
   * @see https://redis.io/commands/hscan
   */
  hscan = /* @__PURE__ */ __name((...args) => this.chain(new HScanCommand(args, this.commandOptions)), "hscan");
  /**
   * @see https://redis.io/commands/hset
   */
  hset = /* @__PURE__ */ __name((key, kv) => this.chain(new HSetCommand([key, kv], this.commandOptions)), "hset");
  /**
   * @see https://redis.io/commands/hsetex
   */
  hsetex = /* @__PURE__ */ __name((...args) => this.chain(new HSetExCommand(args, this.commandOptions)), "hsetex");
  /**
   * @see https://redis.io/commands/hsetnx
   */
  hsetnx = /* @__PURE__ */ __name((key, field, value) => this.chain(new HSetNXCommand([key, field, value], this.commandOptions)), "hsetnx");
  /**
   * @see https://redis.io/commands/hstrlen
   */
  hstrlen = /* @__PURE__ */ __name((...args) => this.chain(new HStrLenCommand(args, this.commandOptions)), "hstrlen");
  /**
   * @see https://redis.io/commands/hvals
   */
  hvals = /* @__PURE__ */ __name((...args) => this.chain(new HValsCommand(args, this.commandOptions)), "hvals");
  /**
   * @see https://redis.io/commands/incr
   */
  incr = /* @__PURE__ */ __name((...args) => this.chain(new IncrCommand(args, this.commandOptions)), "incr");
  /**
   * @see https://redis.io/commands/incrby
   */
  incrby = /* @__PURE__ */ __name((...args) => this.chain(new IncrByCommand(args, this.commandOptions)), "incrby");
  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  incrbyfloat = /* @__PURE__ */ __name((...args) => this.chain(new IncrByFloatCommand(args, this.commandOptions)), "incrbyfloat");
  /**
   * @see https://redis.io/commands/keys
   */
  keys = /* @__PURE__ */ __name((...args) => this.chain(new KeysCommand(args, this.commandOptions)), "keys");
  /**
   * @see https://redis.io/commands/lindex
   */
  lindex = /* @__PURE__ */ __name((...args) => this.chain(new LIndexCommand(args, this.commandOptions)), "lindex");
  /**
   * @see https://redis.io/commands/linsert
   */
  linsert = /* @__PURE__ */ __name((key, direction, pivot, value) => this.chain(new LInsertCommand([key, direction, pivot, value], this.commandOptions)), "linsert");
  /**
   * @see https://redis.io/commands/llen
   */
  llen = /* @__PURE__ */ __name((...args) => this.chain(new LLenCommand(args, this.commandOptions)), "llen");
  /**
   * @see https://redis.io/commands/lmove
   */
  lmove = /* @__PURE__ */ __name((...args) => this.chain(new LMoveCommand(args, this.commandOptions)), "lmove");
  /**
   * @see https://redis.io/commands/lpop
   */
  lpop = /* @__PURE__ */ __name((...args) => this.chain(new LPopCommand(args, this.commandOptions)), "lpop");
  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = /* @__PURE__ */ __name((...args) => this.chain(new LmPopCommand(args, this.commandOptions)), "lmpop");
  /**
   * @see https://redis.io/commands/lpos
   */
  lpos = /* @__PURE__ */ __name((...args) => this.chain(new LPosCommand(args, this.commandOptions)), "lpos");
  /**
   * @see https://redis.io/commands/lpush
   */
  lpush = /* @__PURE__ */ __name((key, ...elements) => this.chain(new LPushCommand([key, ...elements], this.commandOptions)), "lpush");
  /**
   * @see https://redis.io/commands/lpushx
   */
  lpushx = /* @__PURE__ */ __name((key, ...elements) => this.chain(new LPushXCommand([key, ...elements], this.commandOptions)), "lpushx");
  /**
   * @see https://redis.io/commands/lrange
   */
  lrange = /* @__PURE__ */ __name((...args) => this.chain(new LRangeCommand(args, this.commandOptions)), "lrange");
  /**
   * @see https://redis.io/commands/lrem
   */
  lrem = /* @__PURE__ */ __name((key, count3, value) => this.chain(new LRemCommand([key, count3, value], this.commandOptions)), "lrem");
  /**
   * @see https://redis.io/commands/lset
   */
  lset = /* @__PURE__ */ __name((key, index, value) => this.chain(new LSetCommand([key, index, value], this.commandOptions)), "lset");
  /**
   * @see https://redis.io/commands/ltrim
   */
  ltrim = /* @__PURE__ */ __name((...args) => this.chain(new LTrimCommand(args, this.commandOptions)), "ltrim");
  /**
   * @see https://redis.io/commands/mget
   */
  mget = /* @__PURE__ */ __name((...args) => this.chain(new MGetCommand(args, this.commandOptions)), "mget");
  /**
   * @see https://redis.io/commands/mset
   */
  mset = /* @__PURE__ */ __name((kv) => this.chain(new MSetCommand([kv], this.commandOptions)), "mset");
  /**
   * @see https://redis.io/commands/msetnx
   */
  msetnx = /* @__PURE__ */ __name((kv) => this.chain(new MSetNXCommand([kv], this.commandOptions)), "msetnx");
  /**
   * @see https://redis.io/commands/persist
   */
  persist = /* @__PURE__ */ __name((...args) => this.chain(new PersistCommand(args, this.commandOptions)), "persist");
  /**
   * @see https://redis.io/commands/pexpire
   */
  pexpire = /* @__PURE__ */ __name((...args) => this.chain(new PExpireCommand(args, this.commandOptions)), "pexpire");
  /**
   * @see https://redis.io/commands/pexpireat
   */
  pexpireat = /* @__PURE__ */ __name((...args) => this.chain(new PExpireAtCommand(args, this.commandOptions)), "pexpireat");
  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = /* @__PURE__ */ __name((...args) => this.chain(new PfAddCommand(args, this.commandOptions)), "pfadd");
  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = /* @__PURE__ */ __name((...args) => this.chain(new PfCountCommand(args, this.commandOptions)), "pfcount");
  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = /* @__PURE__ */ __name((...args) => this.chain(new PfMergeCommand(args, this.commandOptions)), "pfmerge");
  /**
   * @see https://redis.io/commands/ping
   */
  ping = /* @__PURE__ */ __name((args) => this.chain(new PingCommand(args, this.commandOptions)), "ping");
  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = /* @__PURE__ */ __name((key, ttl, value) => this.chain(new PSetEXCommand([key, ttl, value], this.commandOptions)), "psetex");
  /**
   * @see https://redis.io/commands/pttl
   */
  pttl = /* @__PURE__ */ __name((...args) => this.chain(new PTtlCommand(args, this.commandOptions)), "pttl");
  /**
   * @see https://redis.io/commands/publish
   */
  publish = /* @__PURE__ */ __name((...args) => this.chain(new PublishCommand(args, this.commandOptions)), "publish");
  /**
   * @see https://redis.io/commands/randomkey
   */
  randomkey = /* @__PURE__ */ __name(() => this.chain(new RandomKeyCommand(this.commandOptions)), "randomkey");
  /**
   * @see https://redis.io/commands/rename
   */
  rename = /* @__PURE__ */ __name((...args) => this.chain(new RenameCommand(args, this.commandOptions)), "rename");
  /**
   * @see https://redis.io/commands/renamenx
   */
  renamenx = /* @__PURE__ */ __name((...args) => this.chain(new RenameNXCommand(args, this.commandOptions)), "renamenx");
  /**
   * @see https://redis.io/commands/rpop
   */
  rpop = /* @__PURE__ */ __name((...args) => this.chain(new RPopCommand(args, this.commandOptions)), "rpop");
  /**
   * @see https://redis.io/commands/rpush
   */
  rpush = /* @__PURE__ */ __name((key, ...elements) => this.chain(new RPushCommand([key, ...elements], this.commandOptions)), "rpush");
  /**
   * @see https://redis.io/commands/rpushx
   */
  rpushx = /* @__PURE__ */ __name((key, ...elements) => this.chain(new RPushXCommand([key, ...elements], this.commandOptions)), "rpushx");
  /**
   * @see https://redis.io/commands/sadd
   */
  sadd = /* @__PURE__ */ __name((key, member, ...members) => this.chain(new SAddCommand([key, member, ...members], this.commandOptions)), "sadd");
  /**
   * @see https://redis.io/commands/scan
   */
  scan = /* @__PURE__ */ __name((...args) => this.chain(new ScanCommand(args, this.commandOptions)), "scan");
  /**
   * @see https://redis.io/commands/scard
   */
  scard = /* @__PURE__ */ __name((...args) => this.chain(new SCardCommand(args, this.commandOptions)), "scard");
  /**
   * @see https://redis.io/commands/script-exists
   */
  scriptExists = /* @__PURE__ */ __name((...args) => this.chain(new ScriptExistsCommand(args, this.commandOptions)), "scriptExists");
  /**
   * @see https://redis.io/commands/script-flush
   */
  scriptFlush = /* @__PURE__ */ __name((...args) => this.chain(new ScriptFlushCommand(args, this.commandOptions)), "scriptFlush");
  /**
   * @see https://redis.io/commands/script-load
   */
  scriptLoad = /* @__PURE__ */ __name((...args) => this.chain(new ScriptLoadCommand(args, this.commandOptions)), "scriptLoad");
  /*)*
   * @see https://redis.io/commands/sdiff
   */
  sdiff = /* @__PURE__ */ __name((...args) => this.chain(new SDiffCommand(args, this.commandOptions)), "sdiff");
  /**
   * @see https://redis.io/commands/sdiffstore
   */
  sdiffstore = /* @__PURE__ */ __name((...args) => this.chain(new SDiffStoreCommand(args, this.commandOptions)), "sdiffstore");
  /**
   * @see https://redis.io/commands/set
   */
  set = /* @__PURE__ */ __name((key, value, opts) => this.chain(new SetCommand([key, value, opts], this.commandOptions)), "set");
  /**
   * @see https://redis.io/commands/setbit
   */
  setbit = /* @__PURE__ */ __name((...args) => this.chain(new SetBitCommand(args, this.commandOptions)), "setbit");
  /**
   * @see https://redis.io/commands/setex
   */
  setex = /* @__PURE__ */ __name((key, ttl, value) => this.chain(new SetExCommand([key, ttl, value], this.commandOptions)), "setex");
  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = /* @__PURE__ */ __name((key, value) => this.chain(new SetNxCommand([key, value], this.commandOptions)), "setnx");
  /**
   * @see https://redis.io/commands/setrange
   */
  setrange = /* @__PURE__ */ __name((...args) => this.chain(new SetRangeCommand(args, this.commandOptions)), "setrange");
  /**
   * @see https://redis.io/commands/sinter
   */
  sinter = /* @__PURE__ */ __name((...args) => this.chain(new SInterCommand(args, this.commandOptions)), "sinter");
  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = /* @__PURE__ */ __name((...args) => this.chain(new SInterCardCommand(args, this.commandOptions)), "sintercard");
  /**
   * @see https://redis.io/commands/sinterstore
   */
  sinterstore = /* @__PURE__ */ __name((...args) => this.chain(new SInterStoreCommand(args, this.commandOptions)), "sinterstore");
  /**
   * @see https://redis.io/commands/sismember
   */
  sismember = /* @__PURE__ */ __name((key, member) => this.chain(new SIsMemberCommand([key, member], this.commandOptions)), "sismember");
  /**
   * @see https://redis.io/commands/smembers
   */
  smembers = /* @__PURE__ */ __name((...args) => this.chain(new SMembersCommand(args, this.commandOptions)), "smembers");
  /**
   * @see https://redis.io/commands/smismember
   */
  smismember = /* @__PURE__ */ __name((key, members) => this.chain(new SMIsMemberCommand([key, members], this.commandOptions)), "smismember");
  /**
   * @see https://redis.io/commands/smove
   */
  smove = /* @__PURE__ */ __name((source, destination, member) => this.chain(new SMoveCommand([source, destination, member], this.commandOptions)), "smove");
  /**
   * @see https://redis.io/commands/spop
   */
  spop = /* @__PURE__ */ __name((...args) => this.chain(new SPopCommand(args, this.commandOptions)), "spop");
  /**
   * @see https://redis.io/commands/srandmember
   */
  srandmember = /* @__PURE__ */ __name((...args) => this.chain(new SRandMemberCommand(args, this.commandOptions)), "srandmember");
  /**
   * @see https://redis.io/commands/srem
   */
  srem = /* @__PURE__ */ __name((key, ...members) => this.chain(new SRemCommand([key, ...members], this.commandOptions)), "srem");
  /**
   * @see https://redis.io/commands/sscan
   */
  sscan = /* @__PURE__ */ __name((...args) => this.chain(new SScanCommand(args, this.commandOptions)), "sscan");
  /**
   * @see https://redis.io/commands/strlen
   */
  strlen = /* @__PURE__ */ __name((...args) => this.chain(new StrLenCommand(args, this.commandOptions)), "strlen");
  /**
   * @see https://redis.io/commands/sunion
   */
  sunion = /* @__PURE__ */ __name((...args) => this.chain(new SUnionCommand(args, this.commandOptions)), "sunion");
  /**
   * @see https://redis.io/commands/sunionstore
   */
  sunionstore = /* @__PURE__ */ __name((...args) => this.chain(new SUnionStoreCommand(args, this.commandOptions)), "sunionstore");
  /**
   * @see https://redis.io/commands/time
   */
  time = /* @__PURE__ */ __name(() => this.chain(new TimeCommand(this.commandOptions)), "time");
  /**
   * @see https://redis.io/commands/touch
   */
  touch = /* @__PURE__ */ __name((...args) => this.chain(new TouchCommand(args, this.commandOptions)), "touch");
  /**
   * @see https://redis.io/commands/ttl
   */
  ttl = /* @__PURE__ */ __name((...args) => this.chain(new TtlCommand(args, this.commandOptions)), "ttl");
  /**
   * @see https://redis.io/commands/type
   */
  type = /* @__PURE__ */ __name((...args) => this.chain(new TypeCommand(args, this.commandOptions)), "type");
  /**
   * @see https://redis.io/commands/unlink
   */
  unlink = /* @__PURE__ */ __name((...args) => this.chain(new UnlinkCommand(args, this.commandOptions)), "unlink");
  /**
   * @see https://redis.io/commands/zadd
   */
  zadd = /* @__PURE__ */ __name((...args) => {
    if ("score" in args[1]) {
      return this.chain(
        new ZAddCommand([args[0], args[1], ...args.slice(2)], this.commandOptions)
      );
    }
    return this.chain(
      new ZAddCommand(
        [args[0], args[1], ...args.slice(2)],
        this.commandOptions
      )
    );
  }, "zadd");
  /**
   * @see https://redis.io/commands/xadd
   */
  xadd = /* @__PURE__ */ __name((...args) => this.chain(new XAddCommand(args, this.commandOptions)), "xadd");
  /**
   * @see https://redis.io/commands/xack
   */
  xack = /* @__PURE__ */ __name((...args) => this.chain(new XAckCommand(args, this.commandOptions)), "xack");
  /**
   * @see https://redis.io/commands/xackdel
   */
  xackdel = /* @__PURE__ */ __name((...args) => this.chain(new XAckDelCommand(args, this.commandOptions)), "xackdel");
  /**
   * @see https://redis.io/commands/xdel
   */
  xdel = /* @__PURE__ */ __name((...args) => this.chain(new XDelCommand(args, this.commandOptions)), "xdel");
  /**
   * @see https://redis.io/commands/xdelex
   */
  xdelex = /* @__PURE__ */ __name((...args) => this.chain(new XDelExCommand(args, this.commandOptions)), "xdelex");
  /**
   * @see https://redis.io/commands/xgroup
   */
  xgroup = /* @__PURE__ */ __name((...args) => this.chain(new XGroupCommand(args, this.commandOptions)), "xgroup");
  /**
   * @see https://redis.io/commands/xread
   */
  xread = /* @__PURE__ */ __name((...args) => this.chain(new XReadCommand(args, this.commandOptions)), "xread");
  /**
   * @see https://redis.io/commands/xreadgroup
   */
  xreadgroup = /* @__PURE__ */ __name((...args) => this.chain(new XReadGroupCommand(args, this.commandOptions)), "xreadgroup");
  /**
   * @see https://redis.io/commands/xinfo
   */
  xinfo = /* @__PURE__ */ __name((...args) => this.chain(new XInfoCommand(args, this.commandOptions)), "xinfo");
  /**
   * @see https://redis.io/commands/xlen
   */
  xlen = /* @__PURE__ */ __name((...args) => this.chain(new XLenCommand(args, this.commandOptions)), "xlen");
  /**
   * @see https://redis.io/commands/xpending
   */
  xpending = /* @__PURE__ */ __name((...args) => this.chain(new XPendingCommand(args, this.commandOptions)), "xpending");
  /**
   * @see https://redis.io/commands/xclaim
   */
  xclaim = /* @__PURE__ */ __name((...args) => this.chain(new XClaimCommand(args, this.commandOptions)), "xclaim");
  /**
   * @see https://redis.io/commands/xautoclaim
   */
  xautoclaim = /* @__PURE__ */ __name((...args) => this.chain(new XAutoClaim(args, this.commandOptions)), "xautoclaim");
  /**
   * @see https://redis.io/commands/xtrim
   */
  xtrim = /* @__PURE__ */ __name((...args) => this.chain(new XTrimCommand(args, this.commandOptions)), "xtrim");
  /**
   * @see https://redis.io/commands/xrange
   */
  xrange = /* @__PURE__ */ __name((...args) => this.chain(new XRangeCommand(args, this.commandOptions)), "xrange");
  /**
   * @see https://redis.io/commands/xrevrange
   */
  xrevrange = /* @__PURE__ */ __name((...args) => this.chain(new XRevRangeCommand(args, this.commandOptions)), "xrevrange");
  /**
   * @see https://redis.io/commands/zcard
   */
  zcard = /* @__PURE__ */ __name((...args) => this.chain(new ZCardCommand(args, this.commandOptions)), "zcard");
  /**
   * @see https://redis.io/commands/zcount
   */
  zcount = /* @__PURE__ */ __name((...args) => this.chain(new ZCountCommand(args, this.commandOptions)), "zcount");
  /**
   * @see https://redis.io/commands/zincrby
   */
  zincrby = /* @__PURE__ */ __name((key, increment, member) => this.chain(new ZIncrByCommand([key, increment, member], this.commandOptions)), "zincrby");
  /**
   * @see https://redis.io/commands/zinterstore
   */
  zinterstore = /* @__PURE__ */ __name((...args) => this.chain(new ZInterStoreCommand(args, this.commandOptions)), "zinterstore");
  /**
   * @see https://redis.io/commands/zlexcount
   */
  zlexcount = /* @__PURE__ */ __name((...args) => this.chain(new ZLexCountCommand(args, this.commandOptions)), "zlexcount");
  /**
   * @see https://redis.io/commands/zmscore
   */
  zmscore = /* @__PURE__ */ __name((...args) => this.chain(new ZMScoreCommand(args, this.commandOptions)), "zmscore");
  /**
   * @see https://redis.io/commands/zpopmax
   */
  zpopmax = /* @__PURE__ */ __name((...args) => this.chain(new ZPopMaxCommand(args, this.commandOptions)), "zpopmax");
  /**
   * @see https://redis.io/commands/zpopmin
   */
  zpopmin = /* @__PURE__ */ __name((...args) => this.chain(new ZPopMinCommand(args, this.commandOptions)), "zpopmin");
  /**
   * @see https://redis.io/commands/zrange
   */
  zrange = /* @__PURE__ */ __name((...args) => this.chain(new ZRangeCommand(args, this.commandOptions)), "zrange");
  /**
   * @see https://redis.io/commands/zrank
   */
  zrank = /* @__PURE__ */ __name((key, member) => this.chain(new ZRankCommand([key, member], this.commandOptions)), "zrank");
  /**
   * @see https://redis.io/commands/zrem
   */
  zrem = /* @__PURE__ */ __name((key, ...members) => this.chain(new ZRemCommand([key, ...members], this.commandOptions)), "zrem");
  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  zremrangebylex = /* @__PURE__ */ __name((...args) => this.chain(new ZRemRangeByLexCommand(args, this.commandOptions)), "zremrangebylex");
  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  zremrangebyrank = /* @__PURE__ */ __name((...args) => this.chain(new ZRemRangeByRankCommand(args, this.commandOptions)), "zremrangebyrank");
  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  zremrangebyscore = /* @__PURE__ */ __name((...args) => this.chain(new ZRemRangeByScoreCommand(args, this.commandOptions)), "zremrangebyscore");
  /**
   * @see https://redis.io/commands/zrevrank
   */
  zrevrank = /* @__PURE__ */ __name((key, member) => this.chain(new ZRevRankCommand([key, member], this.commandOptions)), "zrevrank");
  /**
   * @see https://redis.io/commands/zscan
   */
  zscan = /* @__PURE__ */ __name((...args) => this.chain(new ZScanCommand(args, this.commandOptions)), "zscan");
  /**
   * @see https://redis.io/commands/zscore
   */
  zscore = /* @__PURE__ */ __name((key, member) => this.chain(new ZScoreCommand([key, member], this.commandOptions)), "zscore");
  /**
   * @see https://redis.io/commands/zunionstore
   */
  zunionstore = /* @__PURE__ */ __name((...args) => this.chain(new ZUnionStoreCommand(args, this.commandOptions)), "zunionstore");
  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = /* @__PURE__ */ __name((...args) => this.chain(new ZUnionCommand(args, this.commandOptions)), "zunion");
  /**
   * @see https://redis.io/commands/?group=json
   */
  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       */
      arrappend: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrAppendCommand(args, this.commandOptions)), "arrappend"),
      /**
       * @see https://redis.io/commands/json.arrindex
       */
      arrindex: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrIndexCommand(args, this.commandOptions)), "arrindex"),
      /**
       * @see https://redis.io/commands/json.arrinsert
       */
      arrinsert: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrInsertCommand(args, this.commandOptions)), "arrinsert"),
      /**
       * @see https://redis.io/commands/json.arrlen
       */
      arrlen: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrLenCommand(args, this.commandOptions)), "arrlen"),
      /**
       * @see https://redis.io/commands/json.arrpop
       */
      arrpop: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrPopCommand(args, this.commandOptions)), "arrpop"),
      /**
       * @see https://redis.io/commands/json.arrtrim
       */
      arrtrim: /* @__PURE__ */ __name((...args) => this.chain(new JsonArrTrimCommand(args, this.commandOptions)), "arrtrim"),
      /**
       * @see https://redis.io/commands/json.clear
       */
      clear: /* @__PURE__ */ __name((...args) => this.chain(new JsonClearCommand(args, this.commandOptions)), "clear"),
      /**
       * @see https://redis.io/commands/json.del
       */
      del: /* @__PURE__ */ __name((...args) => this.chain(new JsonDelCommand(args, this.commandOptions)), "del"),
      /**
       * @see https://redis.io/commands/json.forget
       */
      forget: /* @__PURE__ */ __name((...args) => this.chain(new JsonForgetCommand(args, this.commandOptions)), "forget"),
      /**
       * @see https://redis.io/commands/json.get
       */
      get: /* @__PURE__ */ __name((...args) => this.chain(new JsonGetCommand(args, this.commandOptions)), "get"),
      /**
       * @see https://redis.io/commands/json.merge
       */
      merge: /* @__PURE__ */ __name((...args) => this.chain(new JsonMergeCommand(args, this.commandOptions)), "merge"),
      /**
       * @see https://redis.io/commands/json.mget
       */
      mget: /* @__PURE__ */ __name((...args) => this.chain(new JsonMGetCommand(args, this.commandOptions)), "mget"),
      /**
       * @see https://redis.io/commands/json.mset
       */
      mset: /* @__PURE__ */ __name((...args) => this.chain(new JsonMSetCommand(args, this.commandOptions)), "mset"),
      /**
       * @see https://redis.io/commands/json.numincrby
       */
      numincrby: /* @__PURE__ */ __name((...args) => this.chain(new JsonNumIncrByCommand(args, this.commandOptions)), "numincrby"),
      /**
       * @see https://redis.io/commands/json.nummultby
       */
      nummultby: /* @__PURE__ */ __name((...args) => this.chain(new JsonNumMultByCommand(args, this.commandOptions)), "nummultby"),
      /**
       * @see https://redis.io/commands/json.objkeys
       */
      objkeys: /* @__PURE__ */ __name((...args) => this.chain(new JsonObjKeysCommand(args, this.commandOptions)), "objkeys"),
      /**
       * @see https://redis.io/commands/json.objlen
       */
      objlen: /* @__PURE__ */ __name((...args) => this.chain(new JsonObjLenCommand(args, this.commandOptions)), "objlen"),
      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: /* @__PURE__ */ __name((...args) => this.chain(new JsonRespCommand(args, this.commandOptions)), "resp"),
      /**
       * @see https://redis.io/commands/json.set
       */
      set: /* @__PURE__ */ __name((...args) => this.chain(new JsonSetCommand(args, this.commandOptions)), "set"),
      /**
       * @see https://redis.io/commands/json.strappend
       */
      strappend: /* @__PURE__ */ __name((...args) => this.chain(new JsonStrAppendCommand(args, this.commandOptions)), "strappend"),
      /**
       * @see https://redis.io/commands/json.strlen
       */
      strlen: /* @__PURE__ */ __name((...args) => this.chain(new JsonStrLenCommand(args, this.commandOptions)), "strlen"),
      /**
       * @see https://redis.io/commands/json.toggle
       */
      toggle: /* @__PURE__ */ __name((...args) => this.chain(new JsonToggleCommand(args, this.commandOptions)), "toggle"),
      /**
       * @see https://redis.io/commands/json.type
       */
      type: /* @__PURE__ */ __name((...args) => this.chain(new JsonTypeCommand(args, this.commandOptions)), "type")
    };
  }
  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       */
      load: /* @__PURE__ */ __name((...args) => this.chain(new FunctionLoadCommand(args, this.commandOptions)), "load"),
      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       */
      list: /* @__PURE__ */ __name((...args) => this.chain(new FunctionListCommand(args, this.commandOptions)), "list"),
      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       */
      delete: /* @__PURE__ */ __name((...args) => this.chain(new FunctionDeleteCommand(args, this.commandOptions)), "delete"),
      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       */
      flush: /* @__PURE__ */ __name(() => this.chain(new FunctionFlushCommand(this.commandOptions)), "flush"),
      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       */
      stats: /* @__PURE__ */ __name(() => this.chain(new FunctionStatsCommand(this.commandOptions)), "stats"),
      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       */
      call: /* @__PURE__ */ __name((...args) => this.chain(new FCallCommand(args, this.commandOptions)), "call"),
      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       */
      callRo: /* @__PURE__ */ __name((...args) => this.chain(new FCallRoCommand(args, this.commandOptions)), "callRo")
    };
  }
};
var MAX_PIPELINE_SIZE = 1e3;
var READ_COMMANDS = /* @__PURE__ */ new Set([
  // String
  "get",
  "getrange",
  "mget",
  "strlen",
  // Bit
  "bitcount",
  "bitpos",
  "getbit",
  // Hash
  "hexists",
  "hget",
  "hgetall",
  "hkeys",
  "hlen",
  "hmget",
  "hrandfield",
  "hscan",
  "hstrlen",
  "httl",
  "hvals",
  "hexpiretime",
  "hpexpiretime",
  "hpttl",
  // List
  "lindex",
  "llen",
  "lpos",
  "lrange",
  // Set
  "scard",
  "sdiff",
  "sinter",
  "sintercard",
  "sismember",
  "smembers",
  "smismember",
  "srandmember",
  "sscan",
  "sunion",
  // Sorted set
  "zcard",
  "zcount",
  "zlexcount",
  "zmscore",
  "zrange",
  "zrank",
  "zrevrank",
  "zscan",
  "zscore",
  "zunion",
  // Key metadata
  "exists",
  "type",
  "ttl",
  "pttl",
  "randomkey",
  "touch",
  // HyperLogLog
  "pfcount",
  // Stream
  "xinfo",
  "xlen",
  "xpending",
  "xrange",
  "xread",
  "xrevrange",
  // Geo
  "geodist",
  "geohash",
  "geopos",
  "geosearch",
  // Script / eval
  "scriptExists",
  "evalRo",
  "evalshaRo",
  // Utility
  "dbsize",
  "echo",
  "ping",
  "time",
  "scan",
  "keys",
  // JSON namespace
  "arrindex",
  "arrlen",
  "objkeys",
  "objlen",
  "resp",
  // Functions namespace
  "list",
  "stats",
  "callRo"
]);
var EXCLUDE_COMMANDS = /* @__PURE__ */ new Set([
  "scan",
  "keys",
  "flushdb",
  "flushall",
  "dbsize",
  "hscan",
  "hgetall",
  "hkeys",
  "lrange",
  "sscan",
  "smembers",
  "xrange",
  "xrevrange",
  "zscan",
  "zrange",
  "exec"
]);
function createAutoPipelineProxy(_redis, namespace = "root") {
  const redis = _redis;
  if (!redis.autoPipelineExecutor) {
    redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
  }
  return new Proxy(redis, {
    get: /* @__PURE__ */ __name((redis2, command) => {
      if (command === "pipelineCounter") {
        return redis2.autoPipelineExecutor.pipelineCounter;
      }
      if (namespace === "root" && command === "json") {
        return createAutoPipelineProxy(redis2, "json");
      }
      if (namespace === "root" && command === "functions") {
        return createAutoPipelineProxy(redis2, "functions");
      }
      if (namespace === "root") {
        const commandInRedisButNotPipeline = command in redis2 && !(command in redis2.autoPipelineExecutor.pipeline);
        const isCommandExcluded = EXCLUDE_COMMANDS.has(command);
        if (commandInRedisButNotPipeline || isCommandExcluded) {
          return redis2[command];
        }
      }
      const pipeline = redis2.autoPipelineExecutor.pipeline;
      const targetFunction = namespace === "json" ? pipeline.json[command] : namespace === "functions" ? pipeline.functions[command] : pipeline[command];
      const isFunction = typeof targetFunction === "function";
      if (isFunction) {
        return (...args) => {
          const commandMode = READ_COMMANDS.has(command) ? "read" : "write";
          return redis2.autoPipelineExecutor.withAutoPipeline(commandMode, (pipeline2) => {
            const targetFunction2 = namespace === "json" ? pipeline2.json[command] : namespace === "functions" ? pipeline2.functions[command] : pipeline2[command];
            targetFunction2(...args);
          });
        };
      }
      return targetFunction;
    }, "get")
  });
}
__name(createAutoPipelineProxy, "createAutoPipelineProxy");
var AutoPipelineExecutor = class {
  static {
    __name(this, "AutoPipelineExecutor");
  }
  pipelinePromises = /* @__PURE__ */ new WeakMap();
  activeReadPipeline = null;
  activeWritePipeline = null;
  readIndex = 0;
  writeIndex = 0;
  redis;
  pipeline;
  // only to make sure that proxy can work
  pipelineCounter = 0;
  // to keep track of how many times a pipeline was executed
  constructor(redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline();
  }
  async withAutoPipeline(commandMode, executeWithPipeline) {
    const isRead = commandMode === "read";
    const activePipeline = isRead ? this.activeReadPipeline : this.activeWritePipeline;
    const pipeline = activePipeline ?? this.redis.pipeline();
    if (!activePipeline) {
      if (isRead) {
        this.activeReadPipeline = pipeline;
        this.readIndex = 0;
      } else {
        this.activeWritePipeline = pipeline;
        this.writeIndex = 0;
      }
    }
    const index = isRead ? this.readIndex++ : this.writeIndex++;
    executeWithPipeline(pipeline);
    if (isRead && this.readIndex >= MAX_PIPELINE_SIZE) {
      this.activeReadPipeline = null;
    } else if (!isRead && this.writeIndex >= MAX_PIPELINE_SIZE) {
      this.activeWritePipeline = null;
    }
    const pipelineDone = this.deferExecution().then(() => {
      if (!this.pipelinePromises.has(pipeline)) {
        const pipelinePromise = pipeline.exec({ keepErrors: true });
        this.pipelineCounter += 1;
        this.pipelinePromises.set(pipeline, pipelinePromise);
        if (this.activeReadPipeline === pipeline) {
          this.activeReadPipeline = null;
        }
        if (this.activeWritePipeline === pipeline) {
          this.activeWritePipeline = null;
        }
      }
      return this.pipelinePromises.get(pipeline);
    });
    const results = await pipelineDone;
    const commandResult = results[index];
    if (commandResult.error) {
      throw new UpstashError(`Command failed: ${commandResult.error}`);
    }
    return commandResult.result;
  }
  async deferExecution() {
    await Promise.resolve();
    await Promise.resolve();
  }
};
var PSubscribeCommand = class extends Command {
  static {
    __name(this, "PSubscribeCommand");
  }
  constructor(cmd, opts) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    };
    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["psubscribe", ...cmd],
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal
      }
    });
  }
};
var Subscriber = class extends EventTarget {
  static {
    __name(this, "Subscriber");
  }
  subscriptions;
  client;
  listeners;
  opts;
  constructor(client, channels, isPattern = false, opts) {
    super();
    this.client = client;
    this.subscriptions = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.opts = opts;
    for (const channel2 of channels) {
      if (isPattern) {
        this.subscribeToPattern(channel2);
      } else {
        this.subscribeToChannel(channel2);
      }
    }
  }
  subscribeToChannel(channel2) {
    const controller = new AbortController();
    const command = new SubscribeCommand([channel2], {
      streamOptions: {
        signal: controller.signal,
        onMessage: /* @__PURE__ */ __name((data) => this.handleMessage(data, false), "onMessage")
      }
    });
    command.exec(this.client).catch((error3) => {
      if (error3.name !== "AbortError") {
        this.dispatchToListeners("error", error3);
      }
    });
    this.subscriptions.set(channel2, {
      command,
      controller,
      isPattern: false
    });
  }
  subscribeToPattern(pattern) {
    const controller = new AbortController();
    const command = new PSubscribeCommand([pattern], {
      streamOptions: {
        signal: controller.signal,
        onMessage: /* @__PURE__ */ __name((data) => this.handleMessage(data, true), "onMessage")
      }
    });
    command.exec(this.client).catch((error3) => {
      if (error3.name !== "AbortError") {
        this.dispatchToListeners("error", error3);
      }
    });
    this.subscriptions.set(pattern, {
      command,
      controller,
      isPattern: true
    });
  }
  handleMessage(data, isPattern) {
    const messageData = data.replace(/^data:\s*/, "");
    const firstCommaIndex = messageData.indexOf(",");
    const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);
    const thirdCommaIndex = isPattern ? messageData.indexOf(",", secondCommaIndex + 1) : -1;
    if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
      const type = messageData.slice(0, firstCommaIndex);
      if (isPattern && type === "pmessage" && thirdCommaIndex !== -1) {
        const pattern = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const channel2 = messageData.slice(secondCommaIndex + 1, thirdCommaIndex);
        const messageStr = messageData.slice(thirdCommaIndex + 1);
        try {
          const message = this.opts?.automaticDeserialization === false ? messageStr : JSON.parse(messageStr);
          this.dispatchToListeners("pmessage", { pattern, channel: channel2, message });
          this.dispatchToListeners(`pmessage:${pattern}`, { pattern, channel: channel2, message });
        } catch (error3) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error3}`));
        }
      } else {
        const channel2 = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const messageStr = messageData.slice(secondCommaIndex + 1);
        try {
          if (type === "subscribe" || type === "psubscribe" || type === "unsubscribe" || type === "punsubscribe") {
            const count3 = Number.parseInt(messageStr);
            this.dispatchToListeners(type, count3);
          } else {
            const message = this.opts?.automaticDeserialization === false ? messageStr : parseWithTryCatch(messageStr);
            this.dispatchToListeners(type, { channel: channel2, message });
            this.dispatchToListeners(`${type}:${channel2}`, { channel: channel2, message });
          }
        } catch (error3) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error3}`));
        }
      }
    }
  }
  dispatchToListeners(type, data) {
    const listeners2 = this.listeners.get(type);
    if (listeners2) {
      for (const listener of listeners2) {
        listener(data);
      }
    }
  }
  on(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, /* @__PURE__ */ new Set());
    }
    this.listeners.get(type)?.add(listener);
  }
  removeAllListeners() {
    this.listeners.clear();
  }
  async unsubscribe(channels) {
    if (channels) {
      for (const channel2 of channels) {
        const subscription = this.subscriptions.get(channel2);
        if (subscription) {
          try {
            subscription.controller.abort();
          } catch {
          }
          this.subscriptions.delete(channel2);
        }
      }
    } else {
      for (const subscription of this.subscriptions.values()) {
        try {
          subscription.controller.abort();
        } catch {
        }
      }
      this.subscriptions.clear();
      this.removeAllListeners();
    }
  }
  getSubscribedChannels() {
    return [...this.subscriptions.keys()];
  }
};
var SubscribeCommand = class extends Command {
  static {
    __name(this, "SubscribeCommand");
  }
  constructor(cmd, opts) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    };
    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["subscribe", ...cmd],
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal
      }
    });
  }
};
var parseWithTryCatch = /* @__PURE__ */ __name((str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}, "parseWithTryCatch");
var Script = class {
  static {
    __name(this, "Script");
  }
  script;
  /**
   * @deprecated This property is initialized to an empty string and will be set in the init method
   * asynchronously. Do not use this property immidiately after the constructor.
   *
   * This property is only exposed for backwards compatibility and will be removed in the
   * future major release.
   */
  sha1;
  initPromise;
  redis;
  constructor(redis, script) {
    this.redis = redis;
    this.script = script;
    this.sha1 = "";
    void this.init(script);
  }
  /**
   * Initialize the script by computing its SHA-1 hash.
   */
  init(script) {
    if (!this.initPromise) {
      this.initPromise = this.digest(script).then((sha1) => {
        this.sha1 = sha1;
      });
    }
    return this.initPromise;
  }
  /**
   * Send an `EVAL` command to redis.
   */
  async eval(keys, args) {
    await this.init(this.script);
    return await this.redis.eval(this.script, keys, args);
  }
  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA`.
   */
  async evalsha(keys, args) {
    await this.init(this.script);
    return await this.redis.evalsha(this.sha1, keys, args);
  }
  /**
   * Optimistically try to run `EVALSHA` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL`.
   *
   * Following calls will be able to use the cached script
   */
  async exec(keys, args) {
    await this.init(this.script);
    const res = await this.redis.evalsha(this.sha1, keys, args).catch(async (error3) => {
      if (error3 instanceof Error && error3.message.toLowerCase().includes("noscript")) {
        return await this.redis.eval(this.script, keys, args);
      }
      throw error3;
    });
    return res;
  }
  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  async digest(s) {
    const data = new TextEncoder().encode(s);
    const hashBuffer = await subtle.digest("SHA-1", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
};
var ScriptRO = class {
  static {
    __name(this, "ScriptRO");
  }
  script;
  /**
   * @deprecated This property is initialized to an empty string and will be set in the init method
   * asynchronously. Do not use this property immidiately after the constructor.
   *
   * This property is only exposed for backwards compatibility and will be removed in the
   * future major release.
   */
  sha1;
  initPromise;
  redis;
  constructor(redis, script) {
    this.redis = redis;
    this.sha1 = "";
    this.script = script;
    void this.init(script);
  }
  init(script) {
    if (!this.initPromise) {
      this.initPromise = this.digest(script).then((sha1) => {
        this.sha1 = sha1;
      });
    }
    return this.initPromise;
  }
  /**
   * Send an `EVAL_RO` command to redis.
   */
  async evalRo(keys, args) {
    await this.init(this.script);
    return await this.redis.evalRo(this.script, keys, args);
  }
  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA_RO`.
   */
  async evalshaRo(keys, args) {
    await this.init(this.script);
    return await this.redis.evalshaRo(this.sha1, keys, args);
  }
  /**
   * Optimistically try to run `EVALSHA_RO` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL_RO`.
   *
   * Following calls will be able to use the cached script
   */
  async exec(keys, args) {
    await this.init(this.script);
    const res = await this.redis.evalshaRo(this.sha1, keys, args).catch(async (error3) => {
      if (error3 instanceof Error && error3.message.toLowerCase().includes("noscript")) {
        return await this.redis.evalRo(this.script, keys, args);
      }
      throw error3;
    });
    return res;
  }
  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  async digest(s) {
    const data = new TextEncoder().encode(s);
    const hashBuffer = await subtle.digest("SHA-1", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
};
var Redis = class {
  static {
    __name(this, "Redis");
  }
  client;
  opts;
  enableTelemetry;
  enableAutoPipelining;
  /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(client, opts) {
    this.client = client;
    this.opts = opts;
    this.enableTelemetry = opts?.enableTelemetry ?? true;
    if (opts?.readYourWrites === false) {
      this.client.readYourWrites = false;
    }
    this.enableAutoPipelining = opts?.enableAutoPipelining ?? true;
  }
  get readYourWritesSyncToken() {
    return this.client.upstashSyncToken;
  }
  set readYourWritesSyncToken(session) {
    this.client.upstashSyncToken = session;
  }
  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       */
      arrappend: /* @__PURE__ */ __name((...args) => new JsonArrAppendCommand(args, this.opts).exec(this.client), "arrappend"),
      /**
       * @see https://redis.io/commands/json.arrindex
       */
      arrindex: /* @__PURE__ */ __name((...args) => new JsonArrIndexCommand(args, this.opts).exec(this.client), "arrindex"),
      /**
       * @see https://redis.io/commands/json.arrinsert
       */
      arrinsert: /* @__PURE__ */ __name((...args) => new JsonArrInsertCommand(args, this.opts).exec(this.client), "arrinsert"),
      /**
       * @see https://redis.io/commands/json.arrlen
       */
      arrlen: /* @__PURE__ */ __name((...args) => new JsonArrLenCommand(args, this.opts).exec(this.client), "arrlen"),
      /**
       * @see https://redis.io/commands/json.arrpop
       */
      arrpop: /* @__PURE__ */ __name((...args) => new JsonArrPopCommand(args, this.opts).exec(this.client), "arrpop"),
      /**
       * @see https://redis.io/commands/json.arrtrim
       */
      arrtrim: /* @__PURE__ */ __name((...args) => new JsonArrTrimCommand(args, this.opts).exec(this.client), "arrtrim"),
      /**
       * @see https://redis.io/commands/json.clear
       */
      clear: /* @__PURE__ */ __name((...args) => new JsonClearCommand(args, this.opts).exec(this.client), "clear"),
      /**
       * @see https://redis.io/commands/json.del
       */
      del: /* @__PURE__ */ __name((...args) => new JsonDelCommand(args, this.opts).exec(this.client), "del"),
      /**
       * @see https://redis.io/commands/json.forget
       */
      forget: /* @__PURE__ */ __name((...args) => new JsonForgetCommand(args, this.opts).exec(this.client), "forget"),
      /**
       * @see https://redis.io/commands/json.get
       */
      get: /* @__PURE__ */ __name((...args) => new JsonGetCommand(args, this.opts).exec(this.client), "get"),
      /**
       * @see https://redis.io/commands/json.merge
       */
      merge: /* @__PURE__ */ __name((...args) => new JsonMergeCommand(args, this.opts).exec(this.client), "merge"),
      /**
       * @see https://redis.io/commands/json.mget
       */
      mget: /* @__PURE__ */ __name((...args) => new JsonMGetCommand(args, this.opts).exec(this.client), "mget"),
      /**
       * @see https://redis.io/commands/json.mset
       */
      mset: /* @__PURE__ */ __name((...args) => new JsonMSetCommand(args, this.opts).exec(this.client), "mset"),
      /**
       * @see https://redis.io/commands/json.numincrby
       */
      numincrby: /* @__PURE__ */ __name((...args) => new JsonNumIncrByCommand(args, this.opts).exec(this.client), "numincrby"),
      /**
       * @see https://redis.io/commands/json.nummultby
       */
      nummultby: /* @__PURE__ */ __name((...args) => new JsonNumMultByCommand(args, this.opts).exec(this.client), "nummultby"),
      /**
       * @see https://redis.io/commands/json.objkeys
       */
      objkeys: /* @__PURE__ */ __name((...args) => new JsonObjKeysCommand(args, this.opts).exec(this.client), "objkeys"),
      /**
       * @see https://redis.io/commands/json.objlen
       */
      objlen: /* @__PURE__ */ __name((...args) => new JsonObjLenCommand(args, this.opts).exec(this.client), "objlen"),
      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: /* @__PURE__ */ __name((...args) => new JsonRespCommand(args, this.opts).exec(this.client), "resp"),
      /**
       * @see https://redis.io/commands/json.set
       */
      set: /* @__PURE__ */ __name((...args) => new JsonSetCommand(args, this.opts).exec(this.client), "set"),
      /**
       * @see https://redis.io/commands/json.strappend
       */
      strappend: /* @__PURE__ */ __name((...args) => new JsonStrAppendCommand(args, this.opts).exec(this.client), "strappend"),
      /**
       * @see https://redis.io/commands/json.strlen
       */
      strlen: /* @__PURE__ */ __name((...args) => new JsonStrLenCommand(args, this.opts).exec(this.client), "strlen"),
      /**
       * @see https://redis.io/commands/json.toggle
       */
      toggle: /* @__PURE__ */ __name((...args) => new JsonToggleCommand(args, this.opts).exec(this.client), "toggle"),
      /**
       * @see https://redis.io/commands/json.type
       */
      type: /* @__PURE__ */ __name((...args) => new JsonTypeCommand(args, this.opts).exec(this.client), "type")
    };
  }
  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       */
      load: /* @__PURE__ */ __name((...args) => new FunctionLoadCommand(args, this.opts).exec(this.client), "load"),
      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       */
      list: /* @__PURE__ */ __name((...args) => new FunctionListCommand(args, this.opts).exec(this.client), "list"),
      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       */
      delete: /* @__PURE__ */ __name((...args) => new FunctionDeleteCommand(args, this.opts).exec(this.client), "delete"),
      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       */
      flush: /* @__PURE__ */ __name(() => new FunctionFlushCommand(this.opts).exec(this.client), "flush"),
      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       *
       * Note: `running_script` field is not supported and therefore not included in the type.
       */
      stats: /* @__PURE__ */ __name(() => new FunctionStatsCommand(this.opts).exec(this.client), "stats"),
      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       */
      call: /* @__PURE__ */ __name((...args) => new FCallCommand(args, this.opts).exec(this.client), "call"),
      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       */
      callRo: /* @__PURE__ */ __name((...args) => new FCallRoCommand(args, this.opts).exec(this.client), "callRo")
    };
  }
  /**
   * Wrap a new middleware around the HTTP client.
   */
  use = /* @__PURE__ */ __name((middleware) => {
    const makeRequest = this.client.request.bind(this.client);
    this.client.request = (req) => middleware(req, makeRequest);
  }, "use");
  /**
   * Technically this is not private, we can hide it from intellisense by doing this
   */
  addTelemetry = /* @__PURE__ */ __name((telemetry) => {
    if (!this.enableTelemetry) {
      return;
    }
    try {
      this.client.mergeTelemetry(telemetry);
    } catch {
    }
  }, "addTelemetry");
  /**
   * Creates a new script.
   *
   * Scripts offer the ability to optimistically try to execute a script without having to send the
   * entire script to the server. If the script is loaded on the server, it tries again by sending
   * the entire script. Afterwards, the script is cached on the server.
   *
   * @param script - The script to create
   * @param opts - Optional options to pass to the script `{ readonly?: boolean }`
   * @returns A new script
   *
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];")
   * const arg1 = await script.eval([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];", { readonly: true })
   * const arg1 = await script.evalRo([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   */
  createScript(script, opts) {
    return opts?.readonly ? new ScriptRO(this, script) : new Script(this, script);
  }
  get search() {
    return {
      createIndex: /* @__PURE__ */ __name((params) => {
        return createIndex(this.client, params);
      }, "createIndex"),
      index: /* @__PURE__ */ __name((params) => {
        return initIndex(this.client, params);
      }, "index"),
      alias: {
        list: /* @__PURE__ */ __name(() => {
          return listAliases(this.client);
        }, "list"),
        add: /* @__PURE__ */ __name(({ indexName, alias }) => {
          return addAlias(this.client, { indexName, alias });
        }, "add"),
        delete: /* @__PURE__ */ __name(({ alias }) => {
          return delAlias(this.client, { alias });
        }, "delete")
      }
    };
  }
  /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */
  pipeline = /* @__PURE__ */ __name(() => new Pipeline({
    client: this.client,
    commandOptions: this.opts,
    multiExec: false
  }), "pipeline");
  autoPipeline = /* @__PURE__ */ __name(() => {
    return createAutoPipelineProxy(this);
  }, "autoPipeline");
  /**
   * Create a new transaction to allow executing multiple steps atomically.
   *
   * All the commands in a transaction are serialized and executed sequentially. A request sent by
   * another client will never be served in the middle of the execution of a Redis Transaction. This
   * guarantees that the commands are executed as a single isolated operation.
   *
   * @see {@link Pipeline}
   */
  multi = /* @__PURE__ */ __name(() => new Pipeline({
    client: this.client,
    commandOptions: this.opts,
    multiExec: true
  }), "multi");
  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [0, 1]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = /* @__PURE__ */ __name((...args) => new BitFieldCommand(args, this.client, this.opts), "bitfield");
  /**
   * @see https://redis.io/commands/append
   */
  append = /* @__PURE__ */ __name((...args) => new AppendCommand(args, this.opts).exec(this.client), "append");
  /**
   * @see https://redis.io/commands/bitcount
   */
  bitcount = /* @__PURE__ */ __name((...args) => new BitCountCommand(args, this.opts).exec(this.client), "bitcount");
  /**
   * @see https://redis.io/commands/bitop
   */
  bitop = /* @__PURE__ */ __name((op, destinationKey, sourceKey, ...sourceKeys) => new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.opts).exec(
    this.client
  ), "bitop");
  /**
   * @see https://redis.io/commands/bitpos
   */
  bitpos = /* @__PURE__ */ __name((...args) => new BitPosCommand(args, this.opts).exec(this.client), "bitpos");
  /**
   * @see https://redis.io/commands/client-setinfo
   */
  clientSetinfo = /* @__PURE__ */ __name((...args) => new ClientSetInfoCommand(args, this.opts).exec(this.client), "clientSetinfo");
  /**
   * @see https://redis.io/commands/copy
   */
  copy = /* @__PURE__ */ __name((...args) => new CopyCommand(args, this.opts).exec(this.client), "copy");
  /**
   * @see https://redis.io/commands/dbsize
   */
  dbsize = /* @__PURE__ */ __name(() => new DBSizeCommand(this.opts).exec(this.client), "dbsize");
  /**
   * @see https://redis.io/commands/decr
   */
  decr = /* @__PURE__ */ __name((...args) => new DecrCommand(args, this.opts).exec(this.client), "decr");
  /**
   * @see https://redis.io/commands/decrby
   */
  decrby = /* @__PURE__ */ __name((...args) => new DecrByCommand(args, this.opts).exec(this.client), "decrby");
  /**
   * @see https://redis.io/commands/del
   */
  del = /* @__PURE__ */ __name((...args) => new DelCommand(args, this.opts).exec(this.client), "del");
  /**
   * @see https://redis.io/commands/echo
   */
  echo = /* @__PURE__ */ __name((...args) => new EchoCommand(args, this.opts).exec(this.client), "echo");
  /**
   * @see https://redis.io/commands/eval_ro
   */
  evalRo = /* @__PURE__ */ __name((...args) => new EvalROCommand(args, this.opts).exec(this.client), "evalRo");
  /**
   * @see https://redis.io/commands/eval
   */
  eval = /* @__PURE__ */ __name((...args) => new EvalCommand(args, this.opts).exec(this.client), "eval");
  /**
   * @see https://redis.io/commands/evalsha_ro
   */
  evalshaRo = /* @__PURE__ */ __name((...args) => new EvalshaROCommand(args, this.opts).exec(this.client), "evalshaRo");
  /**
   * @see https://redis.io/commands/evalsha
   */
  evalsha = /* @__PURE__ */ __name((...args) => new EvalshaCommand(args, this.opts).exec(this.client), "evalsha");
  /**
   * Generic method to execute any Redis command.
   */
  exec = /* @__PURE__ */ __name((args) => new ExecCommand(args, this.opts).exec(this.client), "exec");
  /**
   * @see https://redis.io/commands/exists
   */
  exists = /* @__PURE__ */ __name((...args) => new ExistsCommand(args, this.opts).exec(this.client), "exists");
  /**
   * @see https://redis.io/commands/expire
   */
  expire = /* @__PURE__ */ __name((...args) => new ExpireCommand(args, this.opts).exec(this.client), "expire");
  /**
   * @see https://redis.io/commands/expireat
   */
  expireat = /* @__PURE__ */ __name((...args) => new ExpireAtCommand(args, this.opts).exec(this.client), "expireat");
  /**
   * @see https://redis.io/commands/flushall
   */
  flushall = /* @__PURE__ */ __name((args) => new FlushAllCommand(args, this.opts).exec(this.client), "flushall");
  /**
   * @see https://redis.io/commands/flushdb
   */
  flushdb = /* @__PURE__ */ __name((...args) => new FlushDBCommand(args, this.opts).exec(this.client), "flushdb");
  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = /* @__PURE__ */ __name((...args) => new GeoAddCommand(args, this.opts).exec(this.client), "geoadd");
  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = /* @__PURE__ */ __name((...args) => new GeoPosCommand(args, this.opts).exec(this.client), "geopos");
  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = /* @__PURE__ */ __name((...args) => new GeoDistCommand(args, this.opts).exec(this.client), "geodist");
  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = /* @__PURE__ */ __name((...args) => new GeoHashCommand(args, this.opts).exec(this.client), "geohash");
  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = /* @__PURE__ */ __name((...args) => new GeoSearchCommand(args, this.opts).exec(this.client), "geosearch");
  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = /* @__PURE__ */ __name((...args) => new GeoSearchStoreCommand(args, this.opts).exec(this.client), "geosearchstore");
  /**
   * @see https://redis.io/commands/get
   */
  get = /* @__PURE__ */ __name((...args) => new GetCommand(args, this.opts).exec(this.client), "get");
  /**
   * @see https://redis.io/commands/getbit
   */
  getbit = /* @__PURE__ */ __name((...args) => new GetBitCommand(args, this.opts).exec(this.client), "getbit");
  /**
   * @see https://redis.io/commands/getdel
   */
  getdel = /* @__PURE__ */ __name((...args) => new GetDelCommand(args, this.opts).exec(this.client), "getdel");
  /**
   * @see https://redis.io/commands/getex
   */
  getex = /* @__PURE__ */ __name((...args) => new GetExCommand(args, this.opts).exec(this.client), "getex");
  /**
   * @see https://redis.io/commands/getrange
   */
  getrange = /* @__PURE__ */ __name((...args) => new GetRangeCommand(args, this.opts).exec(this.client), "getrange");
  /**
   * @see https://redis.io/commands/getset
   */
  getset = /* @__PURE__ */ __name((key, value) => new GetSetCommand([key, value], this.opts).exec(this.client), "getset");
  /**
   * @see https://redis.io/commands/hdel
   */
  hdel = /* @__PURE__ */ __name((...args) => new HDelCommand(args, this.opts).exec(this.client), "hdel");
  /**
   * @see https://redis.io/commands/hexists
   */
  hexists = /* @__PURE__ */ __name((...args) => new HExistsCommand(args, this.opts).exec(this.client), "hexists");
  /**
   * @see https://redis.io/commands/hexpire
   */
  hexpire = /* @__PURE__ */ __name((...args) => new HExpireCommand(args, this.opts).exec(this.client), "hexpire");
  /**
   * @see https://redis.io/commands/hexpireat
   */
  hexpireat = /* @__PURE__ */ __name((...args) => new HExpireAtCommand(args, this.opts).exec(this.client), "hexpireat");
  /**
   * @see https://redis.io/commands/hexpiretime
   */
  hexpiretime = /* @__PURE__ */ __name((...args) => new HExpireTimeCommand(args, this.opts).exec(this.client), "hexpiretime");
  /**
   * @see https://redis.io/commands/httl
   */
  httl = /* @__PURE__ */ __name((...args) => new HTtlCommand(args, this.opts).exec(this.client), "httl");
  /**
   * @see https://redis.io/commands/hpexpire
   */
  hpexpire = /* @__PURE__ */ __name((...args) => new HPExpireCommand(args, this.opts).exec(this.client), "hpexpire");
  /**
   * @see https://redis.io/commands/hpexpireat
   */
  hpexpireat = /* @__PURE__ */ __name((...args) => new HPExpireAtCommand(args, this.opts).exec(this.client), "hpexpireat");
  /**
   * @see https://redis.io/commands/hpexpiretime
   */
  hpexpiretime = /* @__PURE__ */ __name((...args) => new HPExpireTimeCommand(args, this.opts).exec(this.client), "hpexpiretime");
  /**
   * @see https://redis.io/commands/hpttl
   */
  hpttl = /* @__PURE__ */ __name((...args) => new HPTtlCommand(args, this.opts).exec(this.client), "hpttl");
  /**
   * @see https://redis.io/commands/hpersist
   */
  hpersist = /* @__PURE__ */ __name((...args) => new HPersistCommand(args, this.opts).exec(this.client), "hpersist");
  /**
   * @see https://redis.io/commands/hget
   */
  hget = /* @__PURE__ */ __name((...args) => new HGetCommand(args, this.opts).exec(this.client), "hget");
  /**
   * @see https://redis.io/commands/hgetall
   */
  hgetall = /* @__PURE__ */ __name((...args) => new HGetAllCommand(args, this.opts).exec(this.client), "hgetall");
  /**
   * @see https://redis.io/commands/hgetdel
   */
  hgetdel = /* @__PURE__ */ __name((...args) => new HGetDelCommand(args, this.opts).exec(this.client), "hgetdel");
  /**
   * @see https://redis.io/commands/hgetex
   */
  hgetex = /* @__PURE__ */ __name((...args) => new HGetExCommand(args, this.opts).exec(this.client), "hgetex");
  /**
   * @see https://redis.io/commands/hincrby
   */
  hincrby = /* @__PURE__ */ __name((...args) => new HIncrByCommand(args, this.opts).exec(this.client), "hincrby");
  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  hincrbyfloat = /* @__PURE__ */ __name((...args) => new HIncrByFloatCommand(args, this.opts).exec(this.client), "hincrbyfloat");
  /**
   * @see https://redis.io/commands/hkeys
   */
  hkeys = /* @__PURE__ */ __name((...args) => new HKeysCommand(args, this.opts).exec(this.client), "hkeys");
  /**
   * @see https://redis.io/commands/hlen
   */
  hlen = /* @__PURE__ */ __name((...args) => new HLenCommand(args, this.opts).exec(this.client), "hlen");
  /**
   * @see https://redis.io/commands/hmget
   */
  hmget = /* @__PURE__ */ __name((...args) => new HMGetCommand(args, this.opts).exec(this.client), "hmget");
  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = /* @__PURE__ */ __name((key, kv) => new HMSetCommand([key, kv], this.opts).exec(this.client), "hmset");
  /**
   * @see https://redis.io/commands/hrandfield
   */
  hrandfield = /* @__PURE__ */ __name((key, count3, withValues) => new HRandFieldCommand([key, count3, withValues], this.opts).exec(this.client), "hrandfield");
  /**
   * @see https://redis.io/commands/hscan
   */
  hscan = /* @__PURE__ */ __name((...args) => new HScanCommand(args, this.opts).exec(this.client), "hscan");
  /**
   * @see https://redis.io/commands/hset
   */
  hset = /* @__PURE__ */ __name((key, kv) => new HSetCommand([key, kv], this.opts).exec(this.client), "hset");
  /**
   * @see https://redis.io/commands/hsetex
   */
  hsetex = /* @__PURE__ */ __name((...args) => new HSetExCommand(args, this.opts).exec(this.client), "hsetex");
  /**
   * @see https://redis.io/commands/hsetnx
   */
  hsetnx = /* @__PURE__ */ __name((key, field, value) => new HSetNXCommand([key, field, value], this.opts).exec(this.client), "hsetnx");
  /**
   * @see https://redis.io/commands/hstrlen
   */
  hstrlen = /* @__PURE__ */ __name((...args) => new HStrLenCommand(args, this.opts).exec(this.client), "hstrlen");
  /**
   * @see https://redis.io/commands/hvals
   */
  hvals = /* @__PURE__ */ __name((...args) => new HValsCommand(args, this.opts).exec(this.client), "hvals");
  /**
   * @see https://redis.io/commands/incr
   */
  incr = /* @__PURE__ */ __name((...args) => new IncrCommand(args, this.opts).exec(this.client), "incr");
  /**
   * @see https://redis.io/commands/incrby
   */
  incrby = /* @__PURE__ */ __name((...args) => new IncrByCommand(args, this.opts).exec(this.client), "incrby");
  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  incrbyfloat = /* @__PURE__ */ __name((...args) => new IncrByFloatCommand(args, this.opts).exec(this.client), "incrbyfloat");
  /**
   * @see https://redis.io/commands/keys
   */
  keys = /* @__PURE__ */ __name((...args) => new KeysCommand(args, this.opts).exec(this.client), "keys");
  /**
   * @see https://redis.io/commands/lindex
   */
  lindex = /* @__PURE__ */ __name((...args) => new LIndexCommand(args, this.opts).exec(this.client), "lindex");
  /**
   * @see https://redis.io/commands/linsert
   */
  linsert = /* @__PURE__ */ __name((key, direction, pivot, value) => new LInsertCommand([key, direction, pivot, value], this.opts).exec(this.client), "linsert");
  /**
   * @see https://redis.io/commands/llen
   */
  llen = /* @__PURE__ */ __name((...args) => new LLenCommand(args, this.opts).exec(this.client), "llen");
  /**
   * @see https://redis.io/commands/lmove
   */
  lmove = /* @__PURE__ */ __name((...args) => new LMoveCommand(args, this.opts).exec(this.client), "lmove");
  /**
   * @see https://redis.io/commands/lpop
   */
  lpop = /* @__PURE__ */ __name((...args) => new LPopCommand(args, this.opts).exec(this.client), "lpop");
  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = /* @__PURE__ */ __name((...args) => new LmPopCommand(args, this.opts).exec(this.client), "lmpop");
  /**
   * @see https://redis.io/commands/lpos
   */
  lpos = /* @__PURE__ */ __name((...args) => new LPosCommand(args, this.opts).exec(this.client), "lpos");
  /**
   * @see https://redis.io/commands/lpush
   */
  lpush = /* @__PURE__ */ __name((key, ...elements) => new LPushCommand([key, ...elements], this.opts).exec(this.client), "lpush");
  /**
   * @see https://redis.io/commands/lpushx
   */
  lpushx = /* @__PURE__ */ __name((key, ...elements) => new LPushXCommand([key, ...elements], this.opts).exec(this.client), "lpushx");
  /**
   * @see https://redis.io/commands/lrange
   */
  lrange = /* @__PURE__ */ __name((...args) => new LRangeCommand(args, this.opts).exec(this.client), "lrange");
  /**
   * @see https://redis.io/commands/lrem
   */
  lrem = /* @__PURE__ */ __name((key, count3, value) => new LRemCommand([key, count3, value], this.opts).exec(this.client), "lrem");
  /**
   * @see https://redis.io/commands/lset
   */
  lset = /* @__PURE__ */ __name((key, index, value) => new LSetCommand([key, index, value], this.opts).exec(this.client), "lset");
  /**
   * @see https://redis.io/commands/ltrim
   */
  ltrim = /* @__PURE__ */ __name((...args) => new LTrimCommand(args, this.opts).exec(this.client), "ltrim");
  /**
   * @see https://redis.io/commands/mget
   */
  mget = /* @__PURE__ */ __name((...args) => new MGetCommand(args, this.opts).exec(this.client), "mget");
  /**
   * @see https://redis.io/commands/mset
   */
  mset = /* @__PURE__ */ __name((kv) => new MSetCommand([kv], this.opts).exec(this.client), "mset");
  /**
   * @see https://redis.io/commands/msetnx
   */
  msetnx = /* @__PURE__ */ __name((kv) => new MSetNXCommand([kv], this.opts).exec(this.client), "msetnx");
  /**
   * @see https://redis.io/commands/persist
   */
  persist = /* @__PURE__ */ __name((...args) => new PersistCommand(args, this.opts).exec(this.client), "persist");
  /**
   * @see https://redis.io/commands/pexpire
   */
  pexpire = /* @__PURE__ */ __name((...args) => new PExpireCommand(args, this.opts).exec(this.client), "pexpire");
  /**
   * @see https://redis.io/commands/pexpireat
   */
  pexpireat = /* @__PURE__ */ __name((...args) => new PExpireAtCommand(args, this.opts).exec(this.client), "pexpireat");
  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = /* @__PURE__ */ __name((...args) => new PfAddCommand(args, this.opts).exec(this.client), "pfadd");
  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = /* @__PURE__ */ __name((...args) => new PfCountCommand(args, this.opts).exec(this.client), "pfcount");
  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = /* @__PURE__ */ __name((...args) => new PfMergeCommand(args, this.opts).exec(this.client), "pfmerge");
  /**
   * @see https://redis.io/commands/ping
   */
  ping = /* @__PURE__ */ __name((args) => new PingCommand(args, this.opts).exec(this.client), "ping");
  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = /* @__PURE__ */ __name((key, ttl, value) => new PSetEXCommand([key, ttl, value], this.opts).exec(this.client), "psetex");
  /**
   * @see https://redis.io/commands/psubscribe
   */
  psubscribe = /* @__PURE__ */ __name((patterns) => {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    return new Subscriber(this.client, patternArray, true, this.opts);
  }, "psubscribe");
  /**
   * @see https://redis.io/commands/pttl
   */
  pttl = /* @__PURE__ */ __name((...args) => new PTtlCommand(args, this.opts).exec(this.client), "pttl");
  /**
   * @see https://redis.io/commands/publish
   */
  publish = /* @__PURE__ */ __name((...args) => new PublishCommand(args, this.opts).exec(this.client), "publish");
  /**
   * @see https://redis.io/commands/randomkey
   */
  randomkey = /* @__PURE__ */ __name(() => new RandomKeyCommand().exec(this.client), "randomkey");
  /**
   * @see https://redis.io/commands/rename
   */
  rename = /* @__PURE__ */ __name((...args) => new RenameCommand(args, this.opts).exec(this.client), "rename");
  /**
   * @see https://redis.io/commands/renamenx
   */
  renamenx = /* @__PURE__ */ __name((...args) => new RenameNXCommand(args, this.opts).exec(this.client), "renamenx");
  /**
   * @see https://redis.io/commands/rpop
   */
  rpop = /* @__PURE__ */ __name((...args) => new RPopCommand(args, this.opts).exec(this.client), "rpop");
  /**
   * @see https://redis.io/commands/rpush
   */
  rpush = /* @__PURE__ */ __name((key, ...elements) => new RPushCommand([key, ...elements], this.opts).exec(this.client), "rpush");
  /**
   * @see https://redis.io/commands/rpushx
   */
  rpushx = /* @__PURE__ */ __name((key, ...elements) => new RPushXCommand([key, ...elements], this.opts).exec(this.client), "rpushx");
  /**
   * @see https://redis.io/commands/sadd
   */
  sadd = /* @__PURE__ */ __name((key, member, ...members) => new SAddCommand([key, member, ...members], this.opts).exec(this.client), "sadd");
  scan(cursor, opts) {
    return new ScanCommand([cursor, opts], this.opts).exec(this.client);
  }
  /**
   * @see https://redis.io/commands/scard
   */
  scard = /* @__PURE__ */ __name((...args) => new SCardCommand(args, this.opts).exec(this.client), "scard");
  /**
   * @see https://redis.io/commands/script-exists
   */
  scriptExists = /* @__PURE__ */ __name((...args) => new ScriptExistsCommand(args, this.opts).exec(this.client), "scriptExists");
  /**
   * @see https://redis.io/commands/script-flush
   */
  scriptFlush = /* @__PURE__ */ __name((...args) => new ScriptFlushCommand(args, this.opts).exec(this.client), "scriptFlush");
  /**
   * @see https://redis.io/commands/script-load
   */
  scriptLoad = /* @__PURE__ */ __name((...args) => new ScriptLoadCommand(args, this.opts).exec(this.client), "scriptLoad");
  /**
   * @see https://redis.io/commands/sdiff
   */
  sdiff = /* @__PURE__ */ __name((...args) => new SDiffCommand(args, this.opts).exec(this.client), "sdiff");
  /**
   * @see https://redis.io/commands/sdiffstore
   */
  sdiffstore = /* @__PURE__ */ __name((...args) => new SDiffStoreCommand(args, this.opts).exec(this.client), "sdiffstore");
  /**
   * @see https://redis.io/commands/set
   */
  set = /* @__PURE__ */ __name((key, value, opts) => new SetCommand([key, value, opts], this.opts).exec(this.client), "set");
  /**
   * @see https://redis.io/commands/setbit
   */
  setbit = /* @__PURE__ */ __name((...args) => new SetBitCommand(args, this.opts).exec(this.client), "setbit");
  /**
   * @see https://redis.io/commands/setex
   */
  setex = /* @__PURE__ */ __name((key, ttl, value) => new SetExCommand([key, ttl, value], this.opts).exec(this.client), "setex");
  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = /* @__PURE__ */ __name((key, value) => new SetNxCommand([key, value], this.opts).exec(this.client), "setnx");
  /**
   * @see https://redis.io/commands/setrange
   */
  setrange = /* @__PURE__ */ __name((...args) => new SetRangeCommand(args, this.opts).exec(this.client), "setrange");
  /**
   * @see https://redis.io/commands/sinter
   */
  sinter = /* @__PURE__ */ __name((...args) => new SInterCommand(args, this.opts).exec(this.client), "sinter");
  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = /* @__PURE__ */ __name((...args) => new SInterCardCommand(args, this.opts).exec(this.client), "sintercard");
  /**
   * @see https://redis.io/commands/sinterstore
   */
  sinterstore = /* @__PURE__ */ __name((...args) => new SInterStoreCommand(args, this.opts).exec(this.client), "sinterstore");
  /**
   * @see https://redis.io/commands/sismember
   */
  sismember = /* @__PURE__ */ __name((key, member) => new SIsMemberCommand([key, member], this.opts).exec(this.client), "sismember");
  /**
   * @see https://redis.io/commands/smismember
   */
  smismember = /* @__PURE__ */ __name((key, members) => new SMIsMemberCommand([key, members], this.opts).exec(this.client), "smismember");
  /**
   * @see https://redis.io/commands/smembers
   */
  smembers = /* @__PURE__ */ __name((...args) => new SMembersCommand(args, this.opts).exec(this.client), "smembers");
  /**
   * @see https://redis.io/commands/smove
   */
  smove = /* @__PURE__ */ __name((source, destination, member) => new SMoveCommand([source, destination, member], this.opts).exec(this.client), "smove");
  /**
   * @see https://redis.io/commands/spop
   */
  spop = /* @__PURE__ */ __name((...args) => new SPopCommand(args, this.opts).exec(this.client), "spop");
  /**
   * @see https://redis.io/commands/srandmember
   */
  srandmember = /* @__PURE__ */ __name((...args) => new SRandMemberCommand(args, this.opts).exec(this.client), "srandmember");
  /**
   * @see https://redis.io/commands/srem
   */
  srem = /* @__PURE__ */ __name((key, ...members) => new SRemCommand([key, ...members], this.opts).exec(this.client), "srem");
  /**
   * @see https://redis.io/commands/sscan
   */
  sscan = /* @__PURE__ */ __name((...args) => new SScanCommand(args, this.opts).exec(this.client), "sscan");
  /**
   * @see https://redis.io/commands/strlen
   */
  strlen = /* @__PURE__ */ __name((...args) => new StrLenCommand(args, this.opts).exec(this.client), "strlen");
  /**
   * @see https://redis.io/commands/subscribe
   */
  subscribe = /* @__PURE__ */ __name((channels) => {
    const channelArray = Array.isArray(channels) ? channels : [channels];
    return new Subscriber(this.client, channelArray, false, this.opts);
  }, "subscribe");
  /**
   * @see https://redis.io/commands/sunion
   */
  sunion = /* @__PURE__ */ __name((...args) => new SUnionCommand(args, this.opts).exec(this.client), "sunion");
  /**
   * @see https://redis.io/commands/sunionstore
   */
  sunionstore = /* @__PURE__ */ __name((...args) => new SUnionStoreCommand(args, this.opts).exec(this.client), "sunionstore");
  /**
   * @see https://redis.io/commands/time
   */
  time = /* @__PURE__ */ __name(() => new TimeCommand().exec(this.client), "time");
  /**
   * @see https://redis.io/commands/touch
   */
  touch = /* @__PURE__ */ __name((...args) => new TouchCommand(args, this.opts).exec(this.client), "touch");
  /**
   * @see https://redis.io/commands/ttl
   */
  ttl = /* @__PURE__ */ __name((...args) => new TtlCommand(args, this.opts).exec(this.client), "ttl");
  /**
   * @see https://redis.io/commands/type
   */
  type = /* @__PURE__ */ __name((...args) => new TypeCommand(args, this.opts).exec(this.client), "type");
  /**
   * @see https://redis.io/commands/unlink
   */
  unlink = /* @__PURE__ */ __name((...args) => new UnlinkCommand(args, this.opts).exec(this.client), "unlink");
  /**
   * @see https://redis.io/commands/xadd
   */
  xadd = /* @__PURE__ */ __name((...args) => new XAddCommand(args, this.opts).exec(this.client), "xadd");
  /**
   * @see https://redis.io/commands/xack
   */
  xack = /* @__PURE__ */ __name((...args) => new XAckCommand(args, this.opts).exec(this.client), "xack");
  /**
   * @see https://redis.io/commands/xackdel
   */
  xackdel = /* @__PURE__ */ __name((...args) => new XAckDelCommand(args, this.opts).exec(this.client), "xackdel");
  /**
   * @see https://redis.io/commands/xdel
   */
  xdel = /* @__PURE__ */ __name((...args) => new XDelCommand(args, this.opts).exec(this.client), "xdel");
  /**
   * @see https://redis.io/commands/xdelex
   */
  xdelex = /* @__PURE__ */ __name((...args) => new XDelExCommand(args, this.opts).exec(this.client), "xdelex");
  /**
   * @see https://redis.io/commands/xgroup
   */
  xgroup = /* @__PURE__ */ __name((...args) => new XGroupCommand(args, this.opts).exec(this.client), "xgroup");
  /**
   * @see https://redis.io/commands/xread
   */
  xread = /* @__PURE__ */ __name((...args) => new XReadCommand(args, this.opts).exec(this.client), "xread");
  /**
   * @see https://redis.io/commands/xreadgroup
   */
  xreadgroup = /* @__PURE__ */ __name((...args) => new XReadGroupCommand(args, this.opts).exec(this.client), "xreadgroup");
  /**
   * @see https://redis.io/commands/xinfo
   */
  xinfo = /* @__PURE__ */ __name((...args) => new XInfoCommand(args, this.opts).exec(this.client), "xinfo");
  /**
   * @see https://redis.io/commands/xlen
   */
  xlen = /* @__PURE__ */ __name((...args) => new XLenCommand(args, this.opts).exec(this.client), "xlen");
  /**
   * @see https://redis.io/commands/xpending
   */
  xpending = /* @__PURE__ */ __name((...args) => new XPendingCommand(args, this.opts).exec(this.client), "xpending");
  /**
   * @see https://redis.io/commands/xclaim
   */
  xclaim = /* @__PURE__ */ __name((...args) => new XClaimCommand(args, this.opts).exec(this.client), "xclaim");
  /**
   * @see https://redis.io/commands/xautoclaim
   */
  xautoclaim = /* @__PURE__ */ __name((...args) => new XAutoClaim(args, this.opts).exec(this.client), "xautoclaim");
  /**
   * @see https://redis.io/commands/xtrim
   */
  xtrim = /* @__PURE__ */ __name((...args) => new XTrimCommand(args, this.opts).exec(this.client), "xtrim");
  /**
   * @see https://redis.io/commands/xrange
   */
  xrange = /* @__PURE__ */ __name((...args) => new XRangeCommand(args, this.opts).exec(this.client), "xrange");
  /**
   * @see https://redis.io/commands/xrevrange
   */
  xrevrange = /* @__PURE__ */ __name((...args) => new XRevRangeCommand(args, this.opts).exec(this.client), "xrevrange");
  /**
   * @see https://redis.io/commands/zadd
   */
  zadd = /* @__PURE__ */ __name((...args) => {
    if ("score" in args[1]) {
      return new ZAddCommand([args[0], args[1], ...args.slice(2)], this.opts).exec(
        this.client
      );
    }
    return new ZAddCommand(
      [args[0], args[1], ...args.slice(2)],
      this.opts
    ).exec(this.client);
  }, "zadd");
  /**
   * @see https://redis.io/commands/zcard
   */
  zcard = /* @__PURE__ */ __name((...args) => new ZCardCommand(args, this.opts).exec(this.client), "zcard");
  /**
   * @see https://redis.io/commands/zcount
   */
  zcount = /* @__PURE__ */ __name((...args) => new ZCountCommand(args, this.opts).exec(this.client), "zcount");
  /**
   * @see https://redis.io/commands/zdiffstore
   */
  zdiffstore = /* @__PURE__ */ __name((...args) => new ZDiffStoreCommand(args, this.opts).exec(this.client), "zdiffstore");
  /**
   * @see https://redis.io/commands/zincrby
   */
  zincrby = /* @__PURE__ */ __name((key, increment, member) => new ZIncrByCommand([key, increment, member], this.opts).exec(this.client), "zincrby");
  /**
   * @see https://redis.io/commands/zinterstore
   */
  zinterstore = /* @__PURE__ */ __name((...args) => new ZInterStoreCommand(args, this.opts).exec(this.client), "zinterstore");
  /**
   * @see https://redis.io/commands/zlexcount
   */
  zlexcount = /* @__PURE__ */ __name((...args) => new ZLexCountCommand(args, this.opts).exec(this.client), "zlexcount");
  /**
   * @see https://redis.io/commands/zmscore
   */
  zmscore = /* @__PURE__ */ __name((...args) => new ZMScoreCommand(args, this.opts).exec(this.client), "zmscore");
  /**
   * @see https://redis.io/commands/zpopmax
   */
  zpopmax = /* @__PURE__ */ __name((...args) => new ZPopMaxCommand(args, this.opts).exec(this.client), "zpopmax");
  /**
   * @see https://redis.io/commands/zpopmin
   */
  zpopmin = /* @__PURE__ */ __name((...args) => new ZPopMinCommand(args, this.opts).exec(this.client), "zpopmin");
  /**
   * @see https://redis.io/commands/zrange
   */
  zrange = /* @__PURE__ */ __name((...args) => new ZRangeCommand(args, this.opts).exec(this.client), "zrange");
  /**
   * @see https://redis.io/commands/zrank
   */
  zrank = /* @__PURE__ */ __name((key, member) => new ZRankCommand([key, member], this.opts).exec(this.client), "zrank");
  /**
   * @see https://redis.io/commands/zrem
   */
  zrem = /* @__PURE__ */ __name((key, ...members) => new ZRemCommand([key, ...members], this.opts).exec(this.client), "zrem");
  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  zremrangebylex = /* @__PURE__ */ __name((...args) => new ZRemRangeByLexCommand(args, this.opts).exec(this.client), "zremrangebylex");
  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  zremrangebyrank = /* @__PURE__ */ __name((...args) => new ZRemRangeByRankCommand(args, this.opts).exec(this.client), "zremrangebyrank");
  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  zremrangebyscore = /* @__PURE__ */ __name((...args) => new ZRemRangeByScoreCommand(args, this.opts).exec(this.client), "zremrangebyscore");
  /**
   * @see https://redis.io/commands/zrevrank
   */
  zrevrank = /* @__PURE__ */ __name((key, member) => new ZRevRankCommand([key, member], this.opts).exec(this.client), "zrevrank");
  /**
   * @see https://redis.io/commands/zscan
   */
  zscan = /* @__PURE__ */ __name((...args) => new ZScanCommand(args, this.opts).exec(this.client), "zscan");
  /**
   * @see https://redis.io/commands/zscore
   */
  zscore = /* @__PURE__ */ __name((key, member) => new ZScoreCommand([key, member], this.opts).exec(this.client), "zscore");
  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = /* @__PURE__ */ __name((...args) => new ZUnionCommand(args, this.opts).exec(this.client), "zunion");
  /**
   * @see https://redis.io/commands/zunionstore
   */
  zunionstore = /* @__PURE__ */ __name((...args) => new ZUnionStoreCommand(args, this.opts).exec(this.client), "zunionstore");
};
var VERSION2 = "v1.38.0";

// node_modules/@upstash/redis/cloudflare.mjs
var Redis2 = class _Redis extends Redis {
  static {
    __name(this, "_Redis");
  }
  /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(config2, env2) {
    if (!config2.url) {
      console.warn(
        `[Upstash Redis] The 'url' property is missing or undefined in your Redis config.`
      );
    } else if (config2.url.startsWith(" ") || config2.url.endsWith(" ") || /\r|\n/.test(config2.url)) {
      console.warn(
        "[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!"
      );
    }
    if (!config2.token) {
      console.warn(
        `[Upstash Redis] The 'token' property is missing or undefined in your Redis config.`
      );
    } else if (config2.token.startsWith(" ") || config2.token.endsWith(" ") || /\r|\n/.test(config2.token)) {
      console.warn(
        "[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!"
      );
    }
    const client = new HttpClient({
      retry: config2.retry,
      baseUrl: config2.url,
      headers: { authorization: `Bearer ${config2.token}` },
      responseEncoding: config2.responseEncoding,
      signal: config2.signal,
      keepAlive: config2.keepAlive,
      readYourWrites: config2.readYourWrites
    });
    super(client, {
      enableTelemetry: config2.enableTelemetry ?? !env2?.UPSTASH_DISABLE_TELEMETRY,
      automaticDeserialization: config2.automaticDeserialization,
      latencyLogging: config2.latencyLogging,
      enableAutoPipelining: config2.enableAutoPipelining
    });
    this.addTelemetry({
      platform: "cloudflare",
      sdk: `@upstash/redis@${VERSION2}`
    });
    if (this.enableAutoPipelining) {
      return this.autoPipeline();
    }
  }
  /*
   * Create a new Upstash Redis instance from environment variables on cloudflare.
   *
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * the global namespace
   *
   * If you are using a module worker, please pass in the `env` object.
   * ```ts
   * const redis = Redis.fromEnv(env)
   * ```
   */
  static fromEnv(env2, opts) {
    const url = env2?.UPSTASH_REDIS_REST_URL ?? // @ts-expect-error These will be defined by cloudflare
    (typeof UPSTASH_REDIS_REST_URL === "string" ? (
      // @ts-expect-error These will be defined by cloudflare
      UPSTASH_REDIS_REST_URL
    ) : void 0);
    const token = env2?.UPSTASH_REDIS_REST_TOKEN ?? // @ts-expect-error These will be defined by cloudflare
    (typeof UPSTASH_REDIS_REST_TOKEN === "string" ? (
      // @ts-expect-error These will be defined by cloudflare
      UPSTASH_REDIS_REST_TOKEN
    ) : void 0);
    const messageInfo = !url && !token ? "Unable to find environment variables: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`" : url ? token ? void 0 : "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`" : "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`";
    if (messageInfo) {
      console.warn(
        `[Upstash Redis] ${messageInfo}. Please add it via \`wrangler secret put ${url ? "UPSTASH_REDIS_REST_TOKEN" : "UPSTASH_REDIS_REST_URL"}\` and provide it as an argument to the \`Redis.fromEnv\` function`
      );
    }
    return new _Redis({ ...opts, url, token }, env2);
  }
};

// src/lib/state.ts
var OFFSET_KEY = "telegram:last_offset";
var HISTORY_KEY = /* @__PURE__ */ __name((chatId) => `telegram:history:${chatId}`, "HISTORY_KEY");
var MAX_HISTORY_PAIRS = 10;
function sanitize(s) {
  let i = 0;
  while (i < s.length && s.charCodeAt(i) === 65279) i++;
  return s.slice(i).trim();
}
__name(sanitize, "sanitize");
function getRedis(env2) {
  return new Redis2({
    url: sanitize(env2.UPSTASH_REDIS_REST_URL),
    token: sanitize(env2.UPSTASH_REDIS_REST_TOKEN)
  });
}
__name(getRedis, "getRedis");
async function getLastOffset(env2) {
  const val = await getRedis(env2).get(OFFSET_KEY);
  return val ?? null;
}
__name(getLastOffset, "getLastOffset");
async function setLastOffset(env2, offset) {
  await getRedis(env2).set(OFFSET_KEY, offset);
}
__name(setLastOffset, "setLastOffset");
async function getHistory(env2, chatId) {
  const raw = await getRedis(env2).get(HISTORY_KEY(chatId));
  return raw ?? [];
}
__name(getHistory, "getHistory");
async function appendHistory(env2, chatId, userMessage, assistantReply) {
  const history = await getHistory(env2, chatId);
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: assistantReply });
  const trimmed = history.slice(-MAX_HISTORY_PAIRS * 2);
  await getRedis(env2).set(HISTORY_KEY(chatId), trimmed, { ex: 86400 });
}
__name(appendHistory, "appendHistory");

// src/worker.ts
var worker_default = {
  // Runs on the cron schedule defined in wrangler.toml (every minute)
  async scheduled(_event, env2) {
    const redisEnv = {
      UPSTASH_REDIS_REST_URL: env2.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: env2.UPSTASH_REDIS_REST_TOKEN
    };
    const lastOffset = await getLastOffset(redisEnv);
    const offset = lastOffset !== null ? lastOffset + 1 : void 0;
    const updates = await getUpdates(env2.TELEGRAM_BOT_TOKEN, offset);
    if (updates.length === 0) return;
    const highestId = Math.max(...updates.map((u) => u.update_id));
    const messages = updates.filter(
      (u) => u.message?.text && String(u.message.chat.id) === env2.TELEGRAM_ALLOWED_CHAT_ID
    );
    for (const update of messages) {
      const { chat, text } = update.message;
      await sendTyping(env2.TELEGRAM_BOT_TOKEN, chat.id);
      const history = await getHistory(redisEnv, chat.id);
      const reply = await generateResponse(env2.ANTHROPIC_API_KEY, history, text);
      await sendMessage(env2.TELEGRAM_BOT_TOKEN, chat.id, reply);
      await appendHistory(redisEnv, chat.id, text, reply);
    }
    await setLastOffset(redisEnv, highestId);
  },
  // Handles HTTP requests — keeps the Worker alive and gives a health check URL
  async fetch(_request, _env) {
    return new Response("Standard Black EA Bot \u2014 running.", { status: 200 });
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
