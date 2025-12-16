import React, { useState } from "react";
import { useConstant } from "@cp949/mui/hooks";

let initCalls = 0;

export function UseConstantPage() {
  const [rerenders, setRerenders] = useState(0);

  const constantValue = useConstant(() => {
    initCalls += 1;
    return { createdAtCall: initCalls, id: Math.random().toString(16).slice(2) };
  });

  return (
    <section className="page" data-testid="page:useConstant">
      <h1 className="h1">useConstant</h1>
      <p className="desc">
        Goal: initializer should not re-run on state-driven re-renders (React dev StrictMode may call it more than once
        on initial mount; this page asserts it stays stable after that).
      </p>

      <div className="card">
        <div className="row">
          <div className="k">rerenders</div>
          <div className="v" data-testid="useConstant:rerenders">
            {rerenders}
          </div>
        </div>
        <div className="row">
          <div className="k">initCalls (module)</div>
          <div className="v" data-testid="useConstant:initCalls">
            {initCalls}
          </div>
        </div>
        <div className="row">
          <div className="k">createdAtCall</div>
          <div className="v" data-testid="useConstant:createdAtCall">
            {constantValue.createdAtCall}
          </div>
        </div>
        <div className="row">
          <div className="k">id</div>
          <div className="v" data-testid="useConstant:id">
            {constantValue.id}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useConstant:rerender"
          onClick={() => setRerenders((n) => n + 1)}
        >
          Force re-render
        </button>
      </div>
    </section>
  );
}


