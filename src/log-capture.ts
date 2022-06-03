/** Adapted from 'mocha-suppress-logs/lib/log-capture' */
import * as util from 'util';

// debug & info == log; warn == error
export type LogLevel = 'trace' | 'debug' | 'info' | 'log' | 'warn' | 'error';
export const LOG_LEVELS = ['trace', 'debug', 'info', 'log', 'warn', 'error'];
const labels = ['TRACE:', 'DEBUG:', 'INFO: ', 'LOG:  ', 'WARN: ', 'ERROR:'];
const originalFunctions = LOG_LEVELS.map((level) => (console as any)[level]);

interface LogRecord {
  level: number;
  args: any[];
}

export class LogCapture {
  private _logs: LogRecord[] = [];
  private _capturing = false;

  get(level?: LogLevel): string[] {
    let logs = this._logs;

    if (level && level !== 'log') {
      const l = LOG_LEVELS.indexOf(level);
      logs = logs.filter((record) => record.level >= l);
    }

    return this.mapLogs(logs, level);
  }

  log(level?: LogLevel) {
    // if (this._capturing) return;
    const l = level === undefined ? 0 : LOG_LEVELS.indexOf(level);
    const newLogs: LogRecord[] = [];

    for (const record of this._logs) {
      if (level && record.level < l) {
        continue;
      }
      if (this._capturing) {
        newLogs.push(record);
      }
      originalFunctions[record.level](...record.args);
    }

    return this.mapLogs(newLogs, level);
  }

  start() {
    if (this._capturing) return;
    this._capturing = true;

    this._logs = [];

    // TODO: support console.group(), .groupEnd()
    // console.groupCollapsed = () => console.group();

    // TODO: console.dir = (obj, options) => { util.inspect(obj); this._logs.push({

    LOG_LEVELS.forEach((level, i) => {
      (console as any)[level] = (...args: any[]) => {
        this._logs.push({ level: i, args });
        // originalFunctions[i](`LogCapture intercepted console.${LOG_LEVELS[i]}(${args})`);
      };
    });
  }

  stop() {
    this._capturing = false;

    LOG_LEVELS.forEach((level, i) => {
      (console as any)[level] = originalFunctions[i];
    });
  }

  isCapturing() {
    return this._capturing;
  }

  reset() {
    this._logs = [];
  }

  private mapLogs(logs: LogRecord[], level?: LogLevel) {
    return logs.map((record) => (level ? '' : labels[record.level] + ' ') + util.format(...record.args));
  }
}

const logCapture = new LogCapture();
export default logCapture;
