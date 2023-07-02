import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { GovernmentEmployeeService } from './government-employee.service';
import { CreateGovernmentEmployeeDto } from './dto/create-government-employee.dto';
import { UpdateGovernmentEmployeeDto } from './dto/update-government-employee.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('government-employee')
export class GovernmentEmployeeController {
  constructor(private readonly governmentEmployeeService: GovernmentEmployeeService) {}

  @Post()
  create(@Body() createGovernmentEmployeeDto: CreateGovernmentEmployeeDto) {
    return this.governmentEmployeeService.create(createGovernmentEmployeeDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.governmentEmployeeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.governmentEmployeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateGovernmentEmployeeDto: UpdateGovernmentEmployeeDto) {
    return this.governmentEmployeeService.update(+id, updateGovernmentEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.governmentEmployeeService.remove(+id);
  }
}
