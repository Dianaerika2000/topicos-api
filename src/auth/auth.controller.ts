import { Controller, Get, Post, Body, HttpCode, UseGuards, Req, Param, Query, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ValidateEmailDto } from './dto/validate-email-dto';
import { Response } from 'express';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
    
  // return Http 200 status code
  @HttpCode(200)
  @Post('register')
  create(@Body() RegisterAuthDto: RegisterAuthDto) {
    return this.authService.createUser(RegisterAuthDto);
  }
  
  @Post('login')
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto);
  }

  @Post('loginActualizado')
  loginActualizado(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.loginActualizado(LoginAuthDto);
  }

  @Post('verify_email')
  validateEmail(@Body() token: ActivateUserDto) {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(AuthGuard())
  @Get('test')
  test (@Req() req: Express.Request) {
    return {
      ok: true,
      message: 'test',
      user: req.user
    };
  }

  // @Get(':email')
  // validateEmail(@Param() email: ValidateEmailDto) {
  //   return this.authService.validateEmail(email);
  // }
  
  @Get('ramdom-number')
  generateRandomNumber(){
    return this.authService.generateRandomNumber();
  }
}
