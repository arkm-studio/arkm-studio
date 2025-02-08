import { NotificationRepository } from "@/services/dashboardService";

// repositories/mockNotificationRepository.ts
export class MockNotificationRepository implements NotificationRepository {
  async getNotificationCount(): Promise<number> {
    return 5; // Mock value
  }
}
