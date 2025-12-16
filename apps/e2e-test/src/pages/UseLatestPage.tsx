import React, { useState } from "react";
import { useLatest } from "@cp949/mui/hooks";

type Result = { kind: "idle" } | { kind: "value"; value: number; via: string };

export function UseLatestPage() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<Result>({ kind: "idle" });

  const latest = useLatest(count);

  const readImmediate = () => {
    setResult({ kind: "value", value: latest.current, via: "immediate" });
  };

  const readDelayed = async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 30));
    setResult({ kind: "value", value: latest.current, via: "delayed(30ms)" });
  };

  return (
    <section className="page" data-testid="page:useLatest">
      <h1 className="h1">useLatest</h1>
      <p className="desc">
        Goal: after rapid state updates, async callbacks should observe the latest committed value.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">count</div>
          <div className="v" data-testid="useLatest:count">
            {count}
          </div>
        </div>
        <div className="row">
          <div className="k">result</div>
          <div className="v" data-testid="useLatest:result">
            {result.kind === "idle" ? "-" : `${result.value} (${result.via})`}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useLatest:inc"
          onClick={() => {
            setResult({ kind: "idle" });
            setCount((c) => c + 1);
          }}
        >
          Increment
        </button>
        <button type="button" className="btn" data-testid="useLatest:readNow" onClick={readImmediate}>
          Read latest (immediate)
        </button>
        <button type="button" className="btn" data-testid="useLatest:readDelayed" onClick={readDelayed}>
          Read latest (delayed)
        </button>
      </div>
    </section>
  );
}


