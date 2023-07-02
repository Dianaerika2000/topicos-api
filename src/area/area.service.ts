import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    try {
      const area = this.areaRepository.create(createAreaDto);
      await this.areaRepository.save(area);
      
      return area;

    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.areaRepository.find();
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOneBy({id});

    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.areaRepository.preload({
      id: id,
      ...updateAreaDto,
    });

    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    return await this.areaRepository.save(area);
  }

  async remove(id: number) {
    const area = await this.areaRepository.findOneBy({ id });

    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    return await this.areaRepository.remove(area);
  }
}
