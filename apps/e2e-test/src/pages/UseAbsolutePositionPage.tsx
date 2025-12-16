import React, { useState } from "react";
import { useAbsolutePosition } from "@cp949/mui/hooks";

export function UseAbsolutePositionPage() {
  const [spacer, setSpacer] = useState(0);
  const [ref, pos] = useAbsolutePosition([spacer], { intervalMs: 0 });

  return (
    <section className="page" data-testid="page:useAbsolutePosition">
      <h1 className="h1">useAbsolutePosition</h1>
      <p className="desc">Goal: when layout above the element changes, absolute y should update accordingly.</p>

      <div className="card">
        <div className="row">
          <div className="k">spacer(px)</div>
          <div className="v" data-testid="useAbsolutePosition:spacer">
            {spacer}
          </div>
        </div>
        <div className="row">
          <div className="k">position</div>
          <div className="v" data-testid="useAbsolutePosition:pos">
            {JSON.stringify(pos)}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useAbsolutePosition:bump"
          onClick={() => setSpacer((n) => n + 80)}
        >
          +80px spacer
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useAbsolutePosition:reset"
          onClick={() => setSpacer(0)}
        >
          Reset spacer
        </button>
      </div>

      <div style={{ height: spacer, background: "rgba(203,214,255,0.08)", borderRadius: 12 }} />

      <div
        ref={ref}
        data-testid="useAbsolutePosition:target"
        style={{
          width: 180,
          height: 64,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.04)",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
        }}
      >
        target
      </div>
    </section>
  );
}


