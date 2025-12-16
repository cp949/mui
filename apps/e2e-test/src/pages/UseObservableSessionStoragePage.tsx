import React, { useMemo, useState } from "react";
import { useObservableSessionStorage } from "@cp949/mui/hooks";

let defaultCalls = 0;

function format(v: unknown) {
  return v == null ? "-" : JSON.stringify(v);
}

function Twin({ label, keyName }: { label: string; keyName: string }) {
  const [localRerenders, setLocalRerenders] = useState(0);

  const [value, setValue] = useObservableSessionStorage<string>(keyName, () => {
    defaultCalls += 1;
    return `default#${defaultCalls}`;
  });

  const view = useMemo(() => ({ value, localRerenders }), [value, localRerenders]);

  return (
    <div className="card" data-testid={`useObservableSessionStorage:twin:${label}`}>
      <div className="row">
        <div className="k">twin</div>
        <div className="v" data-testid={`useObservableSessionStorage:${label}:name`}>
          {label}
        </div>
      </div>
      <div className="row">
        <div className="k">value</div>
        <div className="v" data-testid={`useObservableSessionStorage:${label}:value`}>
          {format(view.value)}
        </div>
      </div>
      <div className="row">
        <div className="k">localRerenders</div>
        <div className="v" data-testid={`useObservableSessionStorage:${label}:rerenders`}>
          {view.localRerenders}
        </div>
      </div>
      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid={`useObservableSessionStorage:${label}:setA`}
          onClick={() => setValue("A")}
        >
          Set A
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableSessionStorage:${label}:setB`}
          onClick={() => setValue("B")}
        >
          Set B
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableSessionStorage:${label}:clear`}
          onClick={() => setValue(null)}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableSessionStorage:${label}:rerender`}
          onClick={() => setLocalRerenders((n) => n + 1)}
        >
          Force re-render
        </button>
      </div>
    </div>
  );
}

export function UseObservableSessionStoragePage() {
  const keyName = "e2e-observable-session";
  return (
    <section className="page" data-testid="page:useObservableSessionStorage">
      <h1 className="h1">useObservableSessionStorage</h1>
      <p className="desc">
        Goal: two hook instances using the same key should stay in sync; default value should remain stable across
        rerenders.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">storageKey</div>
          <div className="v" data-testid="useObservableSessionStorage:key">
            {keyName}
          </div>
        </div>
        <div className="row">
          <div className="k">defaultCalls (module)</div>
          <div className="v" data-testid="useObservableSessionStorage:defaultCalls">
            {defaultCalls}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <Twin label="left" keyName={keyName} />
        <Twin label="right" keyName={keyName} />
      </div>
    </section>
  );
}


