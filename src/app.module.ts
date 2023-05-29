import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciationModule } from './denunciation/denunciation.module';
import { CommonModule } from './common/common.module';
import { TypeDenunciationModule } from './type-denunciation/type-denunciation.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
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
    TypeDenunciationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
