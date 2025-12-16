import React, { useMemo, useState } from "react";
import { useObservableLocalStorage } from "@cp949/mui/hooks";

let defaultCalls = 0;

function format(v: unknown) {
  return v == null ? "-" : JSON.stringify(v);
}

function Twin({ label, keyName }: { label: string; keyName: string }) {
  const [localRerenders, setLocalRerenders] = useState(0);

  const [value, setValue] = useObservableLocalStorage<string>(keyName, () => {
    defaultCalls += 1;
    return `default#${defaultCalls}`;
  });

  const view = useMemo(() => ({ value, localRerenders }), [value, localRerenders]);

  return (
    <div className="card" data-testid={`useObservableLocalStorage:twin:${label}`}>
      <div className="row">
        <div className="k">twin</div>
        <div className="v" data-testid={`useObservableLocalStorage:${label}:name`}>
          {label}
        </div>
      </div>
      <div className="row">
        <div className="k">value</div>
        <div className="v" data-testid={`useObservableLocalStorage:${label}:value`}>
          {format(view.value)}
        </div>
      </div>
      <div className="row">
        <div className="k">localRerenders</div>
        <div className="v" data-testid={`useObservableLocalStorage:${label}:rerenders`}>
          {view.localRerenders}
        </div>
      </div>
      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid={`useObservableLocalStorage:${label}:setA`}
          onClick={() => setValue("A")}
        >
          Set A
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableLocalStorage:${label}:setB`}
          onClick={() => setValue("B")}
        >
          Set B
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableLocalStorage:${label}:clear`}
          onClick={() => setValue(null)}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn"
          data-testid={`useObservableLocalStorage:${label}:rerender`}
          onClick={() => setLocalRerenders((n) => n + 1)}
        >
          Force re-render
        </button>
      </div>
    </div>
  );
}

export function UseObservableLocalStoragePage() {
  const keyName = "e2e-observable-local";
  return (
    <section className="page" data-testid="page:useObservableLocalStorage">
      <h1 className="h1">useObservableLocalStorage</h1>
      <p className="desc">
        Goal: two hook instances using the same key should stay in sync; default value should remain stable across
        rerenders.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">storageKey</div>
          <div className="v" data-testid="useObservableLocalStorage:key">
            {keyName}
          </div>
        </div>
        <div className="row">
          <div className="k">defaultCalls (module)</div>
          <div className="v" data-testid="useObservableLocalStorage:defaultCalls">
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


