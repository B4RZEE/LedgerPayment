"use client";

import { useEffect } from "react";
import { useUiStore } from "@/lib/store/uiStore";

/** Applies the saved theme preference on mount. Used on the auth screens, which don't
 *  otherwise go through AppShell's bootstrap (that only runs once a user is logged in). */
export default function ThemeHydrator() {
  const hydrateTheme = useUiStore((s) => s.hydrateTheme);
  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);
  return null;
}
