import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return this.notificationRepository.save(notification);
  }

  async findAll(paginationDto?: PaginationDto) {
    if (!paginationDto) {
      const result = await this.notificationRepository.find();

      return {
        result: result,
        meta: null,
      };
    }

    const [result, total] = await this.notificationRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      result: result.sort((a, b) => a.id - b.id),
      meta: {
        currentPage: paginationDto.page,
        itemsPerPage: paginationDto.limit,
        totalItems: total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: number) {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string) {
    const where: Partial<Notification> = {};
    where.user_id = userId;

    const result = await this.notificationRepository.find({ where });

    return result.sort((a, b) => a.id - b.id);
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    const newData = this.notificationRepository.create(updateNotificationDto);

    if (notification) {
      notification.is_read = newData.is_read;
      return await this.notificationRepository.save(notification);
    }
  }

  async remove(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (notification) {
      return await this.notificationRepository.remove(notification);
    }
  }
}
