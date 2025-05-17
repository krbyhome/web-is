import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stat } from './entities/stat.entity';

@Injectable()
export class StatService {
    constructor(
        @InjectRepository(Stat)
        private readonly statRepository: Repository<Stat>,
    ) {}

    async findOne(id: string) {
        return await this.statRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Stat[]> {
        return await this.statRepository.find();
    }

    async increment(id: string): Promise<void> {
        const stat = await this.findOne(id);

        if (!stat) {
            await this.statRepository.insert({ id, views: 1 });
            return;
        }

        await this.statRepository.increment({ id }, 'views', 1);
    }
}
