const PIN_KEY = "ledger_pin_v1";

export function getPin(): string {
  return localStorage.getItem(PIN_KEY) || "";
}
export function setPin(p: string): void {
  if (p) localStorage.setItem(PIN_KEY, p);
  else localStorage.removeItem(PIN_KEY);
}
export function isPinSet(): boolean {
  return !!getPin();
}
