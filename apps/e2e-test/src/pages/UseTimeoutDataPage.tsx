import React, { useState } from "react";
import { useTimeoutData } from "@cp949/mui/hooks";

export function UseTimeoutDataPage() {
  const [timeoutMs, setTimeoutMs] = useState(120);
  const [message, setMessage] = useTimeoutData<string>(timeoutMs);

  return (
    <section className="page" data-testid="page:useTimeoutData">
      <h1 className="h1">useTimeoutData</h1>
      <p className="desc">Goal: setting a value shows it immediately, then auto-clears after timeout.</p>

      <div className="card">
        <div className="row">
          <div className="k">timeoutMs</div>
          <div className="v" data-testid="useTimeoutData:timeoutMs">
            {timeoutMs}
          </div>
        </div>
        <div className="row">
          <div className="k">message</div>
          <div className="v" data-testid="useTimeoutData:message">
            {message ?? "-"}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useTimeoutData:show"
          onClick={() => setMessage(`hello@${Date.now()}`)}
        >
          Show message
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useTimeoutData:clear"
          onClick={() => setMessage(null)}
        >
          Clear now
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useTimeoutData:timeoutPlus"
          onClick={() => setTimeoutMs((t) => t + 40)}
        >
          +40ms
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useTimeoutData:timeoutMinus"
          onClick={() => setTimeoutMs((t) => Math.max(40, t - 40))}
        >
          -40ms
        </button>
      </div>
    </section>
  );
}


