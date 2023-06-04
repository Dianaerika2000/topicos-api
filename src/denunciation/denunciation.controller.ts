import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DenunciationService } from './denunciation.service';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('status')
  findAllByStatus( @Query('status') status: string ) {
    return this.denunciationService.findAllByStatus( status );
  }

  @Get('date-range')
  findAllByDateRange( @Query('startDate') startDate: string, @Query('endDate') endDate: string ) {
    const startDateObj = new Date(Date.parse(`${startDate}T00:00:00`));
    const endDateObj = new Date(Date.parse(`${endDate}T23:59:59`));
    return this.denunciationService.findAllByDateRange( startDateObj, endDateObj );
  }

  @Get('type/:typeDenunciationName')
  findAllByTypeDenunciation(@Param('typeDenunciationName') typeDenunciationName: string){
    return this.denunciationService.findAllByTypeDenunciation(typeDenunciationName);
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.denunciationService.uploadImageToCloudinary(file);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('upload/images')
  @UseInterceptors(FileInterceptor('file'))
  async createDenunciationWithImage(
    @Body() createDenunciationDto: CreateDenunciationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.denunciationService.createWithImage(createDenunciationDto, file);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
