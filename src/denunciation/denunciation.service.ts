import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Denunciation } from './entities/denunciation.entity';
import { Between, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TypeDenunciation } from 'src/type-denunciation/entities/type-denunciation.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class DenunciationService {
  constructor(
    @InjectRepository(TypeDenunciation)
    private readonly typeDenunciationRepository: Repository<TypeDenunciation>,
    @InjectRepository(Auth)
    private readonly neighborRepository: Repository<Auth>,
    @InjectRepository(Denunciation)
    private readonly denunciationRepository: Repository<Denunciation>,
    private readonly cloudinaryService: CloudinaryService,
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

  async findAllByStatus( status: string) {
    return await this.denunciationRepository.find({
      where: { status: status },
    });
  }
  
  async findAllByDateRange(startDate: Date, endDate: Date) {
    const denunciations = await this.denunciationRepository.find({
      where: {
        creation_date: Between(startDate, endDate),
      },
    });
    return denunciations;
  }

  async findAllByTypeDenunciation(typeDenunciationName: string): Promise<Denunciation[]> {
    return await this.denunciationRepository
      .createQueryBuilder('denunciation')
      .leftJoinAndSelect('denunciation.type_denunciation', 'typeDenunciation')
      .where('typeDenunciation.name = :typeDenunciationName', { typeDenunciationName })
      .getMany();
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

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(file)
    .catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async createWithImage(createDenunciationDto: CreateDenunciationDto, file: Express.Multer.File) {
    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id: createDenunciationDto.type_denunciation_id });
      const neighbor = await this.neighborRepository.findOneBy({ id: createDenunciationDto.neighbor_id });
  
      if (!typeDenunciation) {
        throw new NotFoundException('Type denunciation not found');
      }
      if (!neighbor) {
        throw new NotFoundException('Neighbor not found');
      }
      
      const url = await this.uploadImageToCloudinary(file);
  
      const denunciation = this.denunciationRepository.create({
        ...createDenunciationDto,
        type_denunciation: typeDenunciation,
        neighbor: neighbor,
      });
  
      await this.denunciationRepository.save(denunciation);
  
      return { denunciation, url };
    } catch (error) {
      this.handleDBError(error);
    }
  }
  
}
