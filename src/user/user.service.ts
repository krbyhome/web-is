import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto, stUserId?: string): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return {
        result: await this.userRepository.find({
          relations: ['projects']
        }),
        meta: null,
      };
    }

    const [result, total] = await this.userRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      result: result.sort(),
      meta: {
        currentPage: paginationDto.page,
        itemsPerPage: paginationDto.limit,
        totalItems: total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
  }

  async findOneByName(username: string) {
    const where: Partial<User> = {};
    where.name = username;

    return await this.userRepository.findOne({ where });
  }

  async findOneByEmail(email: string) {
    const where: Partial<User> = {};
    where.email = email;

    return await this.userRepository.findOne({ where });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    const newData = this.userRepository.create(updateUserDto);

    if (user) {
      user.name = newData.name;
      user.email = newData.email;
      user.avatar_url = newData.avatar_url;

      return this.userRepository.save(user);
    }
  }

  async updateAvatar(id: string, link: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      user.avatar_url = link;
      return this.userRepository.save(user);
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}