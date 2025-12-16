import React, { useRef, useState } from "react";
import { useAudioUnlocked } from "@cp949/mui/hooks";

export function UseAudioUnlockedPage() {
  const [callbackCount, setCallbackCount] = useState(0);
  const callbackCountRef = useRef(0);

  const unlocked = useAudioUnlocked({
    onUnlocked: () => {
      callbackCountRef.current += 1;
      setCallbackCount(callbackCountRef.current);
    },
  });

  return (
    <section className="page" data-testid="page:useAudioUnlocked">
      <h1 className="h1">useAudioUnlocked</h1>
      <p className="desc">
        Goal: a user interaction should flip the stored unlocked state and invoke the callback.
      </p>

      <div className="card">
        <div className="row">
          <div className="k">unlocked</div>
          <div className="v" data-testid="useAudioUnlocked:unlocked">
            {String(unlocked)}
          </div>
        </div>
        <div className="row">
          <div className="k">onUnlocked calls</div>
          <div className="v" data-testid="useAudioUnlocked:calls">
            {callbackCount}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="btn"
          data-testid="useAudioUnlocked:tap"
          onClick={() => {
            // no-op; hook listens on document capture and should unlock on this click.
          }}
        >
          Tap (unlock)
        </button>
        <button
          type="button"
          className="btn"
          data-testid="useAudioUnlocked:clearStorage"
          onClick={() => {
            sessionStorage.removeItem("audio-unlocked");
            window.location.reload();
          }}
        >
          Clear storage + reload
        </button>
      </div>
    </section>
  );
}


