import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ValidateDescriptionDto } from './dto/validate-description.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  validateDescription(@Body() description: ValidateDescriptionDto) {
    console.log('description', description)
    return this.openaiService.validateDescriptionGPT3(description);
  }
}
