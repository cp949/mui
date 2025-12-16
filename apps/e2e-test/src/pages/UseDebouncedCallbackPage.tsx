import React, { useMemo, useState } from "react";
import { useDebouncedCallback } from "@cp949/mui/hooks";

export function UseDebouncedCallbackPage() {
  const [typed, setTyped] = useState("");
  const [committed, setCommitted] = useState("");
  const [commitCount, setCommitCount] = useState(0);

  const debouncedCommit = useDebouncedCallback(
    (next: string) => {
      setCommitted(next);
      setCommitCount((c) => c + 1);
    },
    80,
    { leading: false, trailing: true },
  );

  const status = useMemo(() => {
    return { typed, committed, commitCount };
  }, [typed, committed, commitCount]);

  return (
    <section className="page" data-testid="page:useDebouncedCallback">
      <h1 className="h1">useDebouncedCallback</h1>
      <p className="desc">Goal: only the last call within the wait window should commit; cancel should prevent commit.</p>

      <div className="card">
        <div className="row">
          <div className="k">typed</div>
          <div className="v" data-testid="useDebouncedCallback:typed">
            {status.typed || "-"}
          </div>
        </div>
        <div className="row">
          <div className="k">committed</div>
          <div className="v" data-testid="useDebouncedCallback:committed">
            {status.committed || "-"}
          </div>
        </div>
        <div className="row">
          <div className="k">commitCount</div>
          <div className="v" data-testid="useDebouncedCallback:commitCount">
            {status.commitCount}
          </div>
        </div>
      </div>

      <div className="buttons">
        <input
          className="btn"
          style={{ minWidth: 280 }}
          data-testid="useDebouncedCallback:input"
          value={typed}
          placeholder="Type here..."
          onChange={(e) => {
            const next = e.currentTarget.value;
            setTyped(next);
            debouncedCommit(next);
          }}
        />
        <button
          type="button"
          className="btn"
          data-testid="useDebouncedCallback:cancel"
          onClick={() => debouncedCommit.cancel()}
        >
          Cancel pending
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useDebouncedCallback:reset"
          onClick={() => {
            debouncedCommit.cancel();
            setTyped("");
            setCommitted("");
            setCommitCount(0);
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}


