import { db } from "@/db";

export async function logEvent(event: {
  action: string;
  userId: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}) {
  await db.auditLog.create({ data: event });
}
