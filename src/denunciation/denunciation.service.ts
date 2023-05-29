import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Denunciation } from './entities/denunciation.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TypeDenunciation } from 'src/type-denunciation/entities/type-denunciation.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class DenunciationService {
  constructor(
    @InjectRepository(TypeDenunciation)
    private readonly typeDenunciationRepository: Repository<TypeDenunciation>,
    @InjectRepository(Auth)
    private readonly neighborRepository: Repository<Auth>,
    @InjectRepository(Denunciation)
    private readonly denunciationRepository: Repository<Denunciation>,
  ){}

  async create(createDenunciationDto: CreateDenunciationDto) {
    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id: createDenunciationDto.type_denunciation_id });
      const neighbor = await this.neighborRepository.findOneBy({ id: createDenunciationDto.neighbor_id });

      if (!typeDenunciation){
        throw new NotFoundException('Type denunciation not found');
      }
      if (!neighbor) {
        throw new Error('Neighbor not found');
      }  
      
      const denunciation = this.denunciationRepository.create({
        ...createDenunciationDto,
        type_denunciation: typeDenunciation,
        neighbor: neighbor,
      });

      await this.denunciationRepository.save(denunciation);
      return denunciation;
    } catch (error) {
      this.handleDBError(error);
    } 
  }

  async findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.denunciationRepository.find({
      take: limit,
      skip: offset,
      // TODO: add order by
    });
  }

  async findOne(id: number) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${ id } not found`);
    }
    return await this.denunciationRepository.findOneBy({ id });
  }

  async update(id: number, updateDenunciationDto: UpdateDenunciationDto) {
    const denunciation = await this.denunciationRepository.preload({
      id: id,
      ...updateDenunciationDto,
    });

    if (!denunciation) throw new NotFoundException(`Denunciation with id ${ id } not found`);
    
    try{
      return await this.denunciationRepository.save(denunciation);
    }
    catch (error) {
      this.handleDBError(error);
    }
  }

  async changeStatus(id: number) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${ id } not found`);
    }
    return await this.denunciationRepository.findOneBy({ id });
  }

  private handleDBError(error: any): never {
    if (error.code == 'ER_DUP_ENTRY') {
      throw new BadRequestException('Denunciation already exists');
    }
    throw new InternalServerErrorException('Something went wrong');
  }
}
