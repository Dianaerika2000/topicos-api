import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeDenunciationService } from './type-denunciation.service';
import { CreateTypeDenunciationDto } from './dto/create-type-denunciation.dto';
import { UpdateTypeDenunciationDto } from './dto/update-type-denunciation.dto';

@Controller('type-denunciation')
export class TypeDenunciationController {
  constructor(private readonly typeDenunciationService: TypeDenunciationService) {}

  @Post()
  create(@Body() createTypeDenunciationDto: CreateTypeDenunciationDto) {
    return this.typeDenunciationService.create(createTypeDenunciationDto);
  }

  @Get()
  findAll() {
    return this.typeDenunciationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeDenunciationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDenunciationDto: UpdateTypeDenunciationDto) {
    return this.typeDenunciationService.update(+id, updateTypeDenunciationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeDenunciationService.remove(+id);
  }
}
