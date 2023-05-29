import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { DenunciationService } from './denunciation.service';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('denunciation')
export class DenunciationController {
  constructor(private readonly denunciationService: DenunciationService) {}

  @Post()
  create(@Body() createDenunciationDto: CreateDenunciationDto) {
    return this.denunciationService.create(createDenunciationDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.denunciationService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.denunciationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDenunciationDto: UpdateDenunciationDto
  ) {
    return this.denunciationService.update(id, updateDenunciationDto);
  }

  @Patch(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.denunciationService.changeStatus(id);
  }
}
