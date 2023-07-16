import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwsRekognitionService } from './aws-rekognition.service';
import { DetectLabelsDto } from './dto/detect-labels.dto';
import { CheckTitleDto } from './dto/check-title.dto';

@Controller('rekognition')
export class AwsRekognitionController {
  constructor(private readonly awsRekognitionService: AwsRekognitionService) {}

  @Post('detect-labels')
  async detectLabels(@Body() { image }: DetectLabelsDto) {
    return this.awsRekognitionService.detectLabels(image);
  }

  @Post('check-title')
  checkTitle(@Body() { title, image }: CheckTitleDto) {
    return this.awsRekognitionService.checkTitle(title, image);
  }
}
