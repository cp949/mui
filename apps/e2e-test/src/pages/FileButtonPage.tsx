import React, { useMemo, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { FileButton } from "@cp949/mui";

export function FileButtonPage() {
  const resetRef = useRef<(() => void) | null>(null);
  const [selectedName, setSelectedName] = useState<string>("-");
  const [changeCount, setChangeCount] = useState(0);

  const view = useMemo(() => ({ selectedName, changeCount }), [selectedName, changeCount]);

  return (
    <section className="page" data-testid="page:FileButton">
      <h1 className="h1">FileButton</h1>
      <p className="desc">
        Goal: onChange receives the selected file and resetRef allows re-selecting the same file again.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">selected</div>
          <div className="v" data-testid="FileButton:selected">
            {view.selectedName}
          </div>
        </div>
        <div className="row">
          <div className="k">changeCount</div>
          <div className="v" data-testid="FileButton:changeCount">
            {view.changeCount}
          </div>
        </div>
      </div>

      <div className="buttons">
        <FileButton
          accept="text/plain"
          resetRef={resetRef}
          onChange={(file) => {
            setSelectedName(file.name);
            setChangeCount((c) => c + 1);
          }}
          inputProps={{ "data-testid": "FileButton:input" } as unknown as ComponentPropsWithoutRef<"input">}
        >
          {({ onClick }) => (
            <button type="button" className="btn" data-testid="FileButton:open" onClick={onClick}>
              Choose file
            </button>
          )}
        </FileButton>

        <button
          type="button"
          className="btn"
          data-testid="FileButton:reset"
          onClick={() => {
            resetRef.current?.();
            setSelectedName("-");
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}


