"use client";

import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/store/uiStore";
import { getPin, setPin } from "@/lib/pinLock";

type Phase = "enter" | "confirm" | "verify";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function PinLockOverlay() {
  const pinLock = useUiStore((s) => s.pinLock);
  const hidePinLock = useUiStore((s) => s.hidePinLock);

  if (!pinLock) return null;
  return <PinLockScreen key={pinLock.setup ? "setup" : pinLock.change ? "change" : "verify"} {...pinLock} onDone={hidePinLock} />;
}

function PinLockScreen({ setup, change, onSuccess, onDone }: { setup?: boolean; change?: boolean; onSuccess?: () => void; onDone: () => void }) {
  const isSetup = !!setup;
  const isChange = !!change;
  const [phase, setPhase] = useState<Phase>(isSetup ? "enter" : "verify");
  const [firstPin, setFirstPin] = useState("");
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("⌫");
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, phase, firstPin]);

  function label(): string {
    if (isSetup && phase === "enter") return "Choose a 4-digit PIN";
    if (isSetup && phase === "confirm") return "Confirm your PIN";
    if (isChange && phase === "verify") return "Enter current PIN";
    if (isChange && phase === "enter") return "Choose a new PIN";
    if (isChange && phase === "confirm") return "Confirm new PIN";
    return "Enter your PIN";
  }

  function press(k: string) {
    let next = entry;
    if (k === "⌫") next = entry.slice(0, -1);
    else if (entry.length < 4) next = entry + k;
    setEntry(next);
    setError(false);
    setErrorMsg("");

    if (next.length < 4) return;

    setTimeout(() => {
      if (phase === "verify") {
        if (next === getPin()) {
          onDone();
          onSuccess?.();
        } else {
          setError(true);
          setErrorMsg("Incorrect PIN — try again");
          setTimeout(() => setEntry(""), 700);
        }
      } else if (phase === "enter") {
        setFirstPin(next);
        setEntry("");
        setPhase("confirm");
      } else if (phase === "confirm") {
        if (next === firstPin) {
          setPin(next);
          onDone();
          onSuccess?.();
        } else {
          setError(true);
          setErrorMsg("PINs don't match — start again");
          setTimeout(() => {
            setEntry("");
            setFirstPin("");
            setPhase("enter");
          }, 700);
        }
      }
    }, 120);
  }

  return (
    <div className="pin-screen">
      <div className="pin-logo">Ledger</div>
      <div className="pin-label">{label()}</div>
      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pin-dot${i < entry.length ? " filled" : ""}${error ? " error" : ""}`} />
        ))}
      </div>
      <div className="pin-grid">
        {KEYS.map((k, i) => (
          <button key={i} className={`pin-key${k === "⌫" ? " del" : ""}${k === "" ? " empty" : ""}`} style={{ visibility: k === "" ? "hidden" : undefined }} onClick={() => k && press(k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="pin-error-msg">{errorMsg}</div>
      {!isSetup && !isChange && <div className="pin-change-link">Forgot PIN? Log in again to reset it</div>}
    </div>
  );
}
