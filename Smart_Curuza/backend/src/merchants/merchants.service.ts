import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { User } from '../entities/user.entity';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async getProfile(userId: string): Promise<Merchant> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['merchant'],
    });

    if (user?.merchant) {
      return user.merchant;
    }

    throw new NotFoundException('Merchant profile not found for this user');
  }

  async updateProfile(
    userId: string,
    updateData: Partial<Merchant>,
  ): Promise<Merchant> {
    const merchant = await this.getProfile(userId);
    if (!merchant) throw new NotFoundException('Merchant not found');

    // Selectively update allowed fields to avoid metadata/relation issues
    if (updateData.business_name !== undefined)
      merchant.business_name = updateData.business_name;
    if (updateData.address !== undefined) merchant.address = updateData.address;
    if (updateData.phone !== undefined) merchant.phone = updateData.phone;
    if (updateData.tin !== undefined) merchant.tin = updateData.tin;
    if (updateData.vat_rate !== undefined)
      merchant.vat_rate = updateData.vat_rate;

    const savedMerchant = await this.merchantRepository.save(merchant);

    await this.notificationsService.create({
      title: 'Settings Updated',
      message: `Shop profile settings updated successfully.`,
      type: 'success',
    });

    return savedMerchant;
  }
  async createBusiness(userId: string, data: any): Promise<Merchant> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const merchant = this.merchantRepository.create({
      business_name: data.businessName,
      tin: data.tin,
      address: data.address,
      phone: data.phone,
      owner: user,
    });

    const savedMerchant = await this.merchantRepository.save(merchant);

    user.merchant = savedMerchant;
    await this.userRepository.save(user);

    return savedMerchant;
  }
}
