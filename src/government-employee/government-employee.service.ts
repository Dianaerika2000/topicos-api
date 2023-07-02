import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGovernmentEmployeeDto } from './dto/create-government-employee.dto';
import { UpdateGovernmentEmployeeDto } from './dto/update-government-employee.dto';
import { GovernmentEmployee } from './entities/government-employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from 'src/area/entities/area.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class GovernmentEmployeeService {
  constructor(
    @InjectRepository(GovernmentEmployee)
    private governmentEmployeeRepository: Repository<GovernmentEmployee>,

    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async create(createGovernmentEmployeeDto: CreateGovernmentEmployeeDto) {
    try {
      console.log(createGovernmentEmployeeDto)
      const { area_id, ...governmentEmployeeDetail } = createGovernmentEmployeeDto;
      const area = await this.areaRepository.findOneBy({ id: area_id });
      console.log("area", area)
      if (!area) {
        console.log(area)
        throw new NotFoundException('Area not found');
      }

      const governmentEmployee = this.governmentEmployeeRepository.create({
        ...governmentEmployeeDetail,
        area: area,
      });

      console.log(governmentEmployee);

      return await this.governmentEmployeeRepository.save(governmentEmployee);

    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.governmentEmployeeRepository.find({
      take: limit,
      skip: offset,
      relations: {
        area: true,
      },
    });
  }

  async findOne(id: number) {
    const governmentEmployee = await this.governmentEmployeeRepository.findOneBy({ id });

    if (!governmentEmployee) {
      throw new NotFoundException(`Government Employee with id ${id} not found`);
    }

    return governmentEmployee;
  }

  async update(id: number, updateGovernmentEmployeeDto: UpdateGovernmentEmployeeDto) {
    const { area_id, ...governmentEmployeeDetail } = updateGovernmentEmployeeDto;

    const governmentEmployee = await this.governmentEmployeeRepository.preload({
      id: id,
      ...governmentEmployeeDetail
    });

    if( !governmentEmployee ){
      throw new NotFoundException(`Government Employee with id ${id} not found`);
    }
    
    try {
      if (area_id) {
        const area = await this.areaRepository.findOneBy({ id: area_id });
  
        if (!area) {
          throw new NotFoundException('Area not found');
        }
  
        governmentEmployee.area = area;
      }
      
      return await this.governmentEmployeeRepository.save(governmentEmployee);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: number) {
    const governmentEmployee = await this.governmentEmployeeRepository.findOneBy({ id });

    if (!governmentEmployee) {
      throw new NotFoundException(`Government Employee with id ${id} not found`);
    }

    return await this.governmentEmployeeRepository.remove(governmentEmployee);
  }

  private handleDBError(error: any): never {
    if (error.code == 'ER_DUP_ENTRY') {
      throw new BadRequestException('Denunciation already exists');
    }
    throw new InternalServerErrorException('Something went wrong');
  }
}
