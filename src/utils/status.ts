import { CompletedStatuses, TrackingStatusType } from "@/schemas/tracking-schema"

// Helper function to check if a status is completed
export function isCompletedStatus(status: TrackingStatusType): boolean {
  const completedStatuses = [
    ...CompletedStatuses.DELIVERED,
    ...CompletedStatuses.CANCELLED,
    ...CompletedStatuses.RETURNED,
  ] as TrackingStatusType[];
  
  return completedStatuses.includes(status);
}