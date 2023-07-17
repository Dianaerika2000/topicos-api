import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { DenunciationService } from './denunciation.service';
import { CreateDenunciationDto } from './dto/create-denunciation.dto';
import { UpdateDenunciationDto } from './dto/update-denunciation.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateDescriptionDto } from 'src/openai/dto/validate-description.dto';
import { DateRangeDto } from 'src/common/dtos/dateRange.dto';

@Controller('denunciation')
export class DenunciationController {
  constructor(private readonly denunciationService: DenunciationService) {}

  @Post()
  create(@Body() createDenunciationDto: CreateDenunciationDto) {
    return this.denunciationService.createWithImage64(createDenunciationDto);
  }
  
  @Get('filters')
  findByAllFilters(
    @Query('status') status: string,
    @Query('type') type: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.denunciationService.findByAllFilters(status, type, startDate, endDate);
  }

  @Get()
  findAllNoId() {
    return this.denunciationService.findNoId();
  }

  @Get(':id')
  findAll( @Param('id', ParseUUIDPipe) id: string, @Query() paginationDto: PaginationDto) {
    return this.denunciationService.findAll( paginationDto, id );
  }

  @Get(':id/status')
  findAllByStatus( @Param('id', ParseUUIDPipe) id: string, @Query('status') status: string ) {
    return this.denunciationService.findAllByStatus(status, id);
  }

  @Get(':id/date-range')
  findAllByDateRange( @Param('id', ParseUUIDPipe) id: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string ) {
    const startDateObj = new Date(Date.parse(`${startDate}T00:00:00`));
    const endDateObj = new Date(Date.parse(`${endDate}T23:59:59`));
    return this.denunciationService.findAllByDateRange( startDateObj, endDateObj, id );
  }

  @Get(':id/type/:typeDenunciationName')
  findAllByTypeDenunciation(@Param('id', ParseUUIDPipe) id:string, @Param('typeDenunciationName') typeDenunciationName: string){
    return this.denunciationService.findAllByTypeDenunciation(typeDenunciationName, id);
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
    return this.denunciationService.updateWithImage64(id, updateDenunciationDto);
  }

  @Patch(':id')
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.denunciationService.changeStatus(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.denunciationService.remove(id);
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

  @Post('upload-image64')
  async uploadImage64(@Body('file') file: string) {
    try {
      const result = await this.denunciationService.uploadImage64ToCloudinary(file);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // @Post('description')
  // async validateDescription(@Body() description: string) {
  //   // return this.denunciationService.validateDescription(description);
  //   return this.denunciationService.verifyDescription( description );
  // }

  //Denuncias por tipo para el funcionario 
  @Get('type-denunciation/:id')
  findAllDenunciationsByType( @Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto) {
    return this.denunciationService.findAllByType( paginationDto, id );
  }

  @Get(':id')
  findOneByType(@Param('id', ParseIntPipe) id: number) {
    return this.denunciationService.findOne(id);
  }

  @Patch(':id/status')
  async updateDenunciationStatus(@Param('id') id: number, @Body('status') newStatus: string) {
    const updatedDenunciation = await this.denunciationService.updateDenunciationStatus(id, newStatus);
    return updatedDenunciation;
  }
}
