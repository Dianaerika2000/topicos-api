import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ValidateEmailDto } from './dto/validate-email-dto';
import { on } from 'events';
import { GovernmentEmployee } from 'src/government-employee/entities/government-employee.entity';
import { v4 as uuid } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ActivateUserDto } from './dto/activate-user.dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(Auth) private readonly userRepository: Repository<Auth>, 
    private readonly jwtService: JwtService,
    @InjectRepository(GovernmentEmployee) private readonly governmentEmployeeRepository: Repository<GovernmentEmployee>,
    private readonly mailService: MailService
    ){}
  
  async login(LoginAuthDto: LoginAuthDto) {
    
    const { correo , contrasenia } = LoginAuthDto;
    const user = await this.userRepository.findOne({ where: { correo } });
    if (!user) throw new NotFoundException('User not found');



    // compare password
    const isMatch = await bcrypt.compare(contrasenia , user.contrasenia);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return {
      ...user,
      token: this.generateJwt({id: user.id })
    };
    
  }

  async loginActualizado(LoginAuthDto: LoginAuthDto){
    try {
      const { correo , contrasenia } = LoginAuthDto;
      const user = await this.userRepository.findOne({ where: { correo } });
      const userEmployee = await this.governmentEmployeeRepository.findOne({ where: { email: correo } });
      let isMatch = false;
      let isEmloyee = false;
      if ( user ) {
        isMatch = await bcrypt.compare(contrasenia , user.contrasenia);
      }else if(userEmployee){
        isMatch = await bcrypt.compare(contrasenia , userEmployee.password);
        isEmloyee = true; 
      } else{
        throw new BadRequestException('User not found');
      }
      // compare password
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      return !isEmloyee ? {
        ...user,
        token: this.generateJwt({id: user.id })
      }: {
        ...userEmployee,
        token: this.generateJwt({id: userEmployee.id.toString() })
      };

    }catch (error) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message);
      if (error instanceof UnauthorizedException) throw new UnauthorizedException(error.message);
      console.log('check logs for error'+ error);
      throw new BadRequestException(error.message);
    }
  }

  // create user
  async createUser(registerAuthDto: RegisterAuthDto) {
    
    try {
      
      const {  contrasenia, ci, correo, ...detailsCreateAuthDto } = registerAuthDto;
      
      const emailExists = await this.userRepository.findOne({ where: { correo: correo } });
      if (emailExists) throw new BadRequestException('EMAIL_EXISTS');

      // const activationToken = uuid();

      const user = this.userRepository.create({
        ...detailsCreateAuthDto,
        contrasenia: await bcrypt.hash(contrasenia, 10),
        ci,
        correo, 
        // activation_token: activationToken
      });

      // await this.mailService.sendVerificationEmail(user, activationToken);
      
      await  this.userRepository.save(user);
      
      return {
        ...user,
        token: this.generateJwt({id: user.id })
      };

    } catch (error) {
      
      console.log('check logs for error'+ error);
      throw new BadRequestException(error.message);

    }
  }

  private generateJwt(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateEmail(correo: ValidateEmailDto){
    const { email } = correo;
    const user = await this.userRepository.findOne({ where: { correo:email }});
    console.log(correo);
    if (!user) throw new BadRequestException('EMAIL_NOT_EXISTS');
    return {message:'EMAIL_EXISTS'}
  }

  async verifyEmail(activateUserDto: ActivateUserDto){
    try {
      const { token } = activateUserDto;
      const neighbor = await this.userRepository.findOneBy({ activation_token: token });
      
      if (!neighbor){
        throw new BadRequestException('INVALID_TOKEN');
      }

      if (neighbor.active){
        throw new BadRequestException('USER_ALREADY_ACTIVE');
        console.log('USER_ALREADY_ACTIVE');
      }

      neighbor.active = true;
      neighbor.activation_token = null;
      return await this.userRepository.save(neighbor);
    } catch (error) {
      return error;
    }
  }
}
