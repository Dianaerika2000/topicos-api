import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTypeDenunciationDto } from './dto/create-type-denunciation.dto';
import { UpdateTypeDenunciationDto } from './dto/update-type-denunciation.dto';
import { TypeDenunciation } from './entities/type-denunciation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeDenunciationService {
  constructor(
    @InjectRepository(TypeDenunciation)
    private readonly typeDenunciationRepository: Repository<TypeDenunciation>,
  ) {}
  async create(createTypeDenunciationDto: CreateTypeDenunciationDto) {
    try {
      const typeDenunciation = this.typeDenunciationRepository.create(createTypeDenunciationDto);
      await this.typeDenunciationRepository.save(typeDenunciation);
      return typeDenunciation;
    } catch (error) {
      this.handleDBError(error);
    } 
  }

  async findAll() {
    return await this.typeDenunciationRepository.find(); 
  }

  findOne(id: number) {
    return `This action returns a #${id} typeDenunciation`;
  }

  update(id: number, updateTypeDenunciationDto: UpdateTypeDenunciationDto) {
    return `This action updates a #${id} typeDenunciation`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeDenunciation`;
  }

  private handleDBError(error: any): never {
    if (error.code == 'ER_DUP_ENTRY') {
      throw new BadRequestException('Denunciation already exists');
    }
    throw new InternalServerErrorException('Something went wrong');
  }
}
