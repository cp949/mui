import React from "react";
import { useMounted } from "@cp949/mui/hooks";

export function UseMountedPage() {
  const mounted = useMounted();

  return (
    <section className="page" data-testid="page:useMounted">
      <h1 className="h1">useMounted</h1>
      <p className="desc">Goal: returns false on first render, then true after mount.</p>

      <div className="card">
        <div className="row">
          <div className="k">mounted</div>
          <div className="v" data-testid="useMounted:value">
            {String(mounted)}
          </div>
        </div>
      </div>
    </section>
  );
}


