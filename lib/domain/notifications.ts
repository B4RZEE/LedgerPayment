import { uid } from "@/lib/uid";
import type { AppNotification, LedgerState, NotificationPayload, NotificationType } from "@/lib/store/types";

export function createNotification(
  type: NotificationType,
  title: string,
  body: string,
  payload: NotificationPayload | null = null
): AppNotification {
  return {
    id: uid(),
    type,
    title,
    body: body || "",
    payload,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function unreadNotificationCount(state: LedgerState): number {
  return state.notifications.filter((n) => !n.read).length;
}
