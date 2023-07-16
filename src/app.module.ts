import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciationModule } from './denunciation/denunciation.module';
import { CommonModule } from './common/common.module';
import { TypeDenunciationModule } from './type-denunciation/type-denunciation.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { OpenaiModule } from './openai/openai.module';
import { AreaModule } from './area/area.module';
import { GovernmentEmployeeModule } from './government-employee/government-employee.module';
import { MailModule } from './mail/mail.module';
// import { DenuciationWsModule } from './denuciation-ws/denuciation-ws.module';
import { NotificationModule } from './notification/notification.module';
import { AwsRekognitionModule } from './aws-rekognition/aws-rekognition.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    DenunciationModule,
    CommonModule,
    TypeDenunciationModule,
    CloudinaryModule,
    OpenaiModule,
    AreaModule,
    GovernmentEmployeeModule,
    MailModule,
    NotificationModule,
    AwsRekognitionModule,
    // DenuciationWsModule  
  ],
  controllers: [],
  providers: [CloudinaryModule, CloudinaryService],
})
export class AppModule {}
