import React, { useMemo, useState } from "react";
import { useThrottledCallbackWithClearTimeout } from "@cp949/mui/hooks";

type Entry = { t: number; value: number };

export function UseThrottledCallbackWithClearTimeoutPage() {
  const [log, setLog] = useState<Entry[]>([]);
  const [wait, setWait] = useState(100);

  const [throttled, clearTimer] = useThrottledCallbackWithClearTimeout((value: number) => {
    setLog((prev) => [...prev, { t: Date.now(), value }]);
  }, wait);

  const last = log[log.length - 1]?.value ?? null;
  const count = log.length;

  const view = useMemo(() => ({ count, last, wait }), [count, last, wait]);

  return (
    <section className="page" data-testid="page:useThrottledCallbackWithClearTimeout">
      <h1 className="h1">useThrottledCallbackWithClearTimeout</h1>
      <p className="desc">
        Goal: rapid calls should result in an immediate call and (optionally) a trailing call with latest args.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">wait(ms)</div>
          <div className="v" data-testid="useThrottled:wait">
            {view.wait}
          </div>
        </div>
        <div className="row">
          <div className="k">count</div>
          <div className="v" data-testid="useThrottled:count">
            {view.count}
          </div>
        </div>
        <div className="row">
          <div className="k">last</div>
          <div className="v" data-testid="useThrottled:last">
            {view.last == null ? "-" : String(view.last)}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="button" className="btn" data-testid="useThrottled:fire1" onClick={() => throttled(1)}>
          Fire 1
        </button>
        <button type="button" className="btn" data-testid="useThrottled:fire2" onClick={() => throttled(2)}>
          Fire 2
        </button>
        <button type="button" className="btn" data-testid="useThrottled:fire3" onClick={() => throttled(3)}>
          Fire 3
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useThrottled:clearTimer"
          onClick={() => clearTimer()}
        >
          Clear timer
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useThrottled:reset"
          onClick={() => setLog([])}
        >
          Reset log
        </button>
        <button type="button" className="btn" data-testid="useThrottled:waitPlus" onClick={() => setWait((w) => w + 50)}>
          +50ms wait
        </button>
      </div>
    </section>
  );
}


