import React, { useState } from "react";
import { useScript } from "@cp949/mui/hooks";

declare global {
  var __CP949_E2E_SCRIPT_OK__: number | undefined;
}

export function UseScriptPage() {
  const [src, setSrc] = useState<string>("");
  const status = useScript(src || "/e2e-script-ok.js");

  const okCount = typeof globalThis.__CP949_E2E_SCRIPT_OK__ === "number" ? globalThis.__CP949_E2E_SCRIPT_OK__ : 0;

  return (
    <section className="page" data-testid="page:useScript">
      <h1 className="h1">useScript</h1>
      <p className="desc">Goal: script load should transition to ready/error and expose side-effects.</p>

      <div className="card">
        <div className="row">
          <div className="k">src</div>
          <div className="v" data-testid="useScript:src">
            {src || "/e2e-script-ok.js"}
          </div>
        </div>
        <div className="row">
          <div className="k">status</div>
          <div className="v" data-testid="useScript:status">
            {status}
          </div>
        </div>
        <div className="row">
          <div className="k">okCount(window)</div>
          <div className="v" data-testid="useScript:okCount">
            {okCount} ({status})
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useScript:loadOk"
          onClick={() => setSrc("/e2e-script-ok.js")}
        >
          Load OK script
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useScript:load404"
          onClick={() => setSrc("/e2e-script-404.js")}
        >
          Load 404 script
        </button>
      </div>
    </section>
  );
}


