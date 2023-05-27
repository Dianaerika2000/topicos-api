import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth } from "../entities/auth.entity";
import { JWTPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
        configService: ConfigService
        ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        });
    }
  
    async validate(payload: JWTPayload): Promise<Auth> {
        const { id } = payload;
        const user =  await this.authRepository.findOne({ where: { id } });
        if(!user) throw new UnauthorizedException('Invalid token');

        return user;
    }
}