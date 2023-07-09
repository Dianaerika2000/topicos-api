import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTypeDenunciationDto } from './dto/create-type-denunciation.dto';
import { UpdateTypeDenunciationDto } from './dto/update-type-denunciation.dto';
import { TypeDenunciation } from './entities/type-denunciation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/area/entities/area.entity';

@Injectable()
export class TypeDenunciationService {
  constructor(
    @InjectRepository(TypeDenunciation)
    private readonly typeDenunciationRepository: Repository<TypeDenunciation>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(createTypeDenunciationDto: CreateTypeDenunciationDto) {  
    try {
      const { name, area_id } = createTypeDenunciationDto;
      const area = await this.areaRepository.findOneBy({
        id: area_id 
      });

      if (!area) {
        throw new NotFoundException('Area not found');
      }

      const typeDenunciation = this.typeDenunciationRepository.create({
        name: name,
        area: area,
      });

      return await this.typeDenunciationRepository.save(typeDenunciation);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll() {
    return await this.typeDenunciationRepository.find({
      relations: ['area']
    }); 
  }

  async findOne(id: number) {
    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id });

      if (!typeDenunciation) {
        throw new NotFoundException(`TypeDenunciation with ID ${id} not found`);
      }

      return typeDenunciation;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async update(id: number, updateTypeDenunciationDto: UpdateTypeDenunciationDto) {
    const { area_id, ...typeDenunciationDetail } = updateTypeDenunciationDto;

    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id });

      if (!typeDenunciation) {
        throw new NotFoundException(`TypeDenunciation with ID ${id} not found`);
      }

      if (area_id) {
        const area = await this.areaRepository.findOneBy({id: area_id});

        if (!area) {
          throw new NotFoundException(`Area with ID ${area_id} not found`);
        }

        typeDenunciation.area = area;
      }

      Object.assign(typeDenunciation, typeDenunciationDetail);

      await this.typeDenunciationRepository.save(typeDenunciation);

      return typeDenunciation;
    } catch (error) {
      this.handleDBError(error);
    }
  }
  
  async remove(id: number) {
    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id });

      if (!typeDenunciation) {
        throw new NotFoundException(`TypeDenunciation with ID ${id} not found`);
      }

      await this.typeDenunciationRepository.remove(typeDenunciation);

      return typeDenunciation;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any): never {
    if (error.code == 'ER_DUP_ENTRY') {
      throw new BadRequestException('Denunciation already exists');
    }
    throw new InternalServerErrorException('Something went wrong');
  }
}
