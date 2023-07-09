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

  @Get('verify_email')
  validateEmail(@Query() token: ActivateUserDto, @Res() response: Response) {
    // response.set('Cache-Control', 'no-store'); 
    // response.set('Pragma', 'no-cache');
    // const domain = this.configService.get('FRONTEND_URL');
    // const url = `${domain}/app-login`;  
    // await this.authService.activateUser(token);
    // response.redirect(201, url);
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
  
}
