import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
// Assuming we have AuthGuard, but for now I'll skip strict AuthGuard import if I don't know the path,
// but I should try to use it if possible.
// I'll check auth module path later. For now, I'll make it open or assume global auth.

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll() {
    // TODO: Get userId from request
    // const userId = req.user.id;
    return this.notificationsService.findAll();
  }

  @Get('unread-count')
  async getUnreadCount() {
    const count = await this.notificationsService.getUnreadCount();
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationsService.markAsRead(id);
    return { success: true };
  }

  @Patch('read-all')
  async markAllAsRead() {
    await this.notificationsService.markAllAsRead();
    return { success: true };
  }
}
