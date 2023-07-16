import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Denunciation } from './entities/denunciation.entity';
import { Any, Between, DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TypeDenunciation } from 'src/type-denunciation/entities/type-denunciation.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Images } from './entities/images.entity';
import { Readable } from 'typeorm/platform/PlatformTools';
import { v4 as uuid } from 'uuid'
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { OpenaiService } from 'src/openai/openai.service';
import { DateRangeDto } from 'src/common/dtos/dateRange.dto';
import { Notification } from './entities/notification.entity';
import axios from 'axios';

@Injectable()
export class DenunciationService {
  
  constructor(
    @InjectRepository(TypeDenunciation)
    private readonly typeDenunciationRepository: Repository<TypeDenunciation>,
    
    @InjectRepository(Auth)
    private readonly neighborRepository: Repository<Auth>,
    
    @InjectRepository(Denunciation)
    private readonly denunciationRepository: Repository<Denunciation>,
    
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    
    private readonly dataSource: DataSource,
    
    private readonly cloudinaryService: CloudinaryService,

    private readonly httpService: HttpService,

    private readonly configService: ConfigService,

    private readonly openAIService: OpenaiService,
  ){}
    
  async findNoId() {
    try{
      const denunciations = await this.denunciationRepository.find({
        relations: {
          neighbor: true,
          type_denunciation: true,
          images: true,
        },
      });
      return denunciations;
    }catch (error) {
      throw new BadRequestException(error.message);
    }
  }


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
      
      const { images = [], ...denunciationDetails } = createDenunciationDto      

      const denunciation = this.denunciationRepository.create({
        ...denunciationDetails,
        type_denunciation: typeDenunciation,
        neighbor: neighbor,
        images: images.map( image => this.imagesRepository.create({ url: image }))
      });

      await this.imagesRepository.save(denunciation.images);
      await this.denunciationRepository.save(denunciation);
      
      return denunciation;

    } catch (error) {
      this.handleDBError(error);
    } 
  }

  async createWithImage64(createDenunciationDto: CreateDenunciationDto) {
    try {
      const typeDenunciation = await this.typeDenunciationRepository.findOneBy({ id: createDenunciationDto.type_denunciation_id });
      const neighbor = await this.neighborRepository.findOneBy({ id: createDenunciationDto.neighbor_id });

      if (!typeDenunciation){
        throw new NotFoundException('Type denunciation not found');
      }
      if (!neighbor) {
        throw new Error('Neighbor not found');
      }  

      const { images = [], description, ...denunciationDetails } = createDenunciationDto;

      // const descriptionValidated: boolean = await this.validateDescription(description); // by Jasmany
     // const descriptionValidated: boolean = await this.verifyDescription(description); // by ME
      
     /*  if( descriptionValidated ){
        return new BadRequestException({
          error: 'La denuncia contiene palabras ofensivas',
        });
      } */

      const urls: string[] = await Promise.all(images.map(async image => await this.uploadImage64ToCloudinary(image)));

      const denunciation = this.denunciationRepository.create({
        ...denunciationDetails,
        description: description,
        type_denunciation: typeDenunciation,
        neighbor: neighbor,
        images: urls.map( image => this.imagesRepository.create({ url: image }))
        // images: images.map( image => this.imagesRepository.create({ url: image }))
      });

      await this.imagesRepository.save(denunciation.images);
      await this.denunciationRepository.save(denunciation);
      
      return denunciation;

    } catch (error) {
      this.handleDBError(error);
    } 
  }

  async findAll( paginationDto: PaginationDto, id: string) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.denunciationRepository.find({
      take: limit,
      skip: offset,
      relations: {
        neighbor: true,
        type_denunciation: true,
        images: true,
      },
      where: { neighbor: {id: id}}
    });
  }

  async findAllByType( paginationDto: PaginationDto, id: number) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.denunciationRepository.find({
      take: limit,
      skip: offset,
      relations: {
        neighbor: true,
        type_denunciation: true,
        images: true,
      },
      where: { type_denunciation: {id: id}}
    });
  }

  async findAllByStatus( status: string, id: string) {
    return await this.denunciationRepository.find({
      where: { status: status, neighbor: {id: id} },
    });
  }
  
  async findAllByDateRange(startDate: Date, endDate: Date, id: string) {
    const denunciations = await this.denunciationRepository.find({
      where: {
        creation_date: Between(startDate, endDate),
        neighbor: {id: id}
      },
    });
    return denunciations;
  }
  async findByAllFilters(status: string, type: string, startDate: string, endDate: string) {
    try {
      let startDateObj = startDate ? new Date(`${startDate}T00:00:00`) : null;
      let endDateObj = endDate ? new Date(`${endDate}T23:59:59`) : null;

      const queryBuilder = this.denunciationRepository
        .createQueryBuilder('denunciation')
        .leftJoinAndSelect('denunciation.type_denunciation', 'typeDenunciation')
        .where('1 = 1'); // Condición inicial para poder agregar condiciones dinámicamente

      // Filtrar por estado si se proporciona
      if (status) {
        queryBuilder.andWhere('denunciation.status = :status', { status });
      }

      // Filtrar por tipo si se proporciona
      if (type) {
        queryBuilder.andWhere('typeDenunciation.id = :type', { type });
      }

      // Filtrar por rango de fechas si se proporciona
      if (startDateObj && endDateObj) {
        queryBuilder.andWhere('denunciation.creation_date BETWEEN :startDate AND :endDate', {
          startDate: startDateObj,
          endDate: endDateObj,
        });
      }

      const denunciations = await queryBuilder.getMany();

      return denunciations;

    }catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllByTypeDenunciation(typeDenunciationName: string, id: string): Promise<Denunciation[]> {
    return await this.denunciationRepository
      .createQueryBuilder('denunciation')
      .leftJoinAndSelect('denunciation.type_denunciation', 'typeDenunciation')
      .leftJoinAndSelect('denunciation.images', 'images')
      .leftJoinAndSelect('denunciation.neighbor', 'neighbor')
      .where('typeDenunciation.name = :typeDenunciationName', { typeDenunciationName })
      .andWhere('neighbor.id = :id', { id })
      .getMany();
  }
  
  async findOne(id: number) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${ id } not found`);
    }
    return await this.denunciationRepository.findOneBy({ id });
  }

  async findOneByType(id: number) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${ id } not found`);
    }
    return await this.denunciationRepository.findOneBy({ id });
  }

  async update(id: number, updateDenunciationDto: UpdateDenunciationDto) {
    const { images,...denunciationDetails } = updateDenunciationDto;

    const denunciation = await this.denunciationRepository.preload({
      id: id,
      ...denunciationDetails, 
    });
    
    if (!denunciation) throw new NotFoundException(`Denunciation with id ${ id } not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
    
      if( images ){
        await queryRunner.manager.delete(Images, { denunciation: { id } });
        denunciation.images = images.map( image => this.imagesRepository.create({ url: image }));
      }else{
        denunciation.images = await this.imagesRepository.findBy({ denunciation: { id } });
      }
      
      await queryRunner.manager.save( denunciation );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return denunciation;
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    }
  }

  async updateWithImage64(id: number, updateDenunciationDto: UpdateDenunciationDto) {
    const { images,...denunciationDetails } = updateDenunciationDto;

    const denunciation = await this.denunciationRepository.preload({
      id: id,
      ...denunciationDetails, 
    });
    
    if (!denunciation) throw new NotFoundException(`Denunciation with id ${ id } not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
    
      if( images ){
        await queryRunner.manager.delete(Images, { denunciation: { id } });

        const urls: string[] = await Promise.all(images.map(async image => await this.uploadImage64ToCloudinary(image)));

        denunciation.images = urls.map( image => this.imagesRepository.create({ url: image }));
      }else{
        denunciation.images = await this.imagesRepository.findBy({ denunciation: { id } });
      }
      
      await queryRunner.manager.save( denunciation );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return denunciation;
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    }
  }

  async remove(id: number) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${ id } not found`);
    }
    return await this.denunciationRepository.remove(denunciation);
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
  
  async uploadImage64ToCloudinary(base64Image: string) {
    try {
      const buffer = Buffer.from(base64Image, 'base64');
      const sharp = require('sharp');
      const processedImage = await sharp(buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

      const uniqueFilename = `${uuid()}.jpg`;

      const file: Express.Multer.File = {
        buffer: processedImage,
        originalname: `${ uniqueFilename }`,
        mimetype: 'image/jpeg',
        fieldname: 'image',
        encoding: 'base64',
        size: processedImage.length,
        stream: Readable.from(processedImage),
        destination: '',
        filename: `${ uniqueFilename }`,
        path: '',
      };

      const uploadedImg = await this.cloudinaryService.uploadImage(file);
      const { url } = uploadedImg;

      return url;
    } catch (error) {
      throw new BadRequestException('Invalid file type.');
    }
  }

  async validateDescription( description: string ): Promise<any> {
    try {
      const response = await firstValueFrom(this.httpService.post(this.configService.get('URL_VALIDATION_DESCRIPTION'), { texto: description }));
      console.log('openai', response.data.es_obsceno);
      // return true;
      return response.data.es_obsceno;
    } catch (error) {
      throw new BadRequestException('Invalid description.');
    }
  }

  // async verifyDescription( description: string ) {
  //   const validatedDescription = await this.openAIService.validateDescriptionGPT3( description );
  //   console.log(validatedDescription);
  //   return validatedDescription == 'Si' || 'Si.' ? true : false;
  // }

  async updateDenunciationStatus(id: number, newStatus: string) {
    const denunciation = await this.denunciationRepository.findOneBy({ id });
  
    if (!denunciation) {
      throw new NotFoundException(`Denunciation with id ${id} not found`);
    }
  
    const oldStatus = denunciation.status;
  
    denunciation.status = newStatus;
    const updatedDenunciation = await this.denunciationRepository.save(denunciation);
  
    // Crear una notificación de edición de estado de denuncia
    const notification = this.notificationRepository.create({
      title: "denuncia_editada",
      description: `La denuncia con id ${id} ha sido editada`,
      denunciation: updatedDenunciation,
    });
    await this.notificationRepository.save(notification);
  
    // Construir el JSON de la notificación
    const notificationJson = {
      notification: {
        body: `La denunica ${denunciation.title} que realizaste ha sido ${newStatus}`,
        title: `Tu denuncia ha sido ${newStatus}`,
      },
      to: `${this.configService.get('TO_TOKEN')}`,
    };
  
    // Llamar a la función para enviar la notificación a FCM
    await this.sendNotificationToFCM(notificationJson);
  
    return updatedDenunciation;
  }

  async sendNotificationToFCM(notificationJson: any) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `key=${this.configService.get('FCM_SERVER_KEY')}}`
    };
  
    try {
      await axios.post('https://fcm.googleapis.com/fcm/send', notificationJson, { headers });
      // console.log(first)
    } catch (error) {
      // Manejar errores de solicitud
      console.error('Error al enviar la notificación a FCM:', error);
    }
  }
}
