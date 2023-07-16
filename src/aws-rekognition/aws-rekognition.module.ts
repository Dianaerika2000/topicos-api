import { Module } from '@nestjs/common';
import { AwsRekognitionService } from './aws-rekognition.service';
import { AwsRekognitionController } from './aws-rekognition.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule ],
  controllers: [AwsRekognitionController],
  providers: [AwsRekognitionService]
})
export class AwsRekognitionModule {}
