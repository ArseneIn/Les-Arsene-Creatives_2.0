import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    return this.notificationsRepository.save(notification);
  }

  async findAll(userId?: string): Promise<Notification[]> {
    // If userId is provided, filter by it. If not, maybe return all?
    // For now, let's assume we want all notifications for the authenticated user.
    // Since we don't have strict user context passed here yet, we might need to adjust.
    // But typically this is called from a Controller with user info.

    const where = userId ? { user_id: userId } : {};
    return this.notificationsRepository.find({
      where,
      order: { created_at: 'DESC' },
      take: 50, // Limit to last 50
    });
  }

  async getUnreadCount(userId?: string): Promise<number> {
    const where = userId
      ? { user_id: userId, is_read: false }
      : { is_read: false };
    return this.notificationsRepository.count({ where });
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationsRepository.update(id, { is_read: true });
  }

  async markAllAsRead(userId?: string): Promise<void> {
    const where = userId
      ? { user_id: userId, is_read: false }
      : { is_read: false };
    await this.notificationsRepository.update(where, { is_read: true });
  }
}
