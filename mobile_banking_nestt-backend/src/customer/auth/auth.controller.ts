import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { FileInterceptor } from "@nestjs/platform-express";
// import { MulterError, diskStorage } from "multer";
import * as bcrypt from 'bcrypt';
import { LoginDTO, New_PasswordDTO } from '../customer.dto';
import { AuthGuard } from './auth.guard';

@Controller('api/customer/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/index')
  // @UseGuards(SessionGuard)
  // @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  getIndex(): any {
    return 'Relax! Customer Auth is working.';
  }

  @Post('/signup')
  // @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Signup(@Body() signup_info: LoginDTO): Promise<any> {
    try {
      signup_info.password = await bcrypt.hash(signup_info.password, 12);

      const user_id = await this.authService.signUp(signup_info);
      if (user_id < 0) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Email Already Exists',
        });
      } else {
        return user_id;
      }
    } catch (e) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
      });
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  @UsePipes(new ValidationPipe())
  async Login(@Body() login_info: LoginDTO): Promise<any> {
    return await this.authService.signIn(login_info);
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async Logout(@Request() req): Promise<any> {
    try {
      const token = await this.authService.extractTokenFromHeader(req);
      if (token != null && token != '') {
        return await this.authService.logout(req.user.email, token);
      } else {
        throw new BadRequestException(
          'Please provide the token inside header, along with the request',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('/change_password')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Change_password(
    @Request() req,
    @Body()
    new_Password_Object_DTO: New_PasswordDTO,
  ): Promise<any> {
    console.log('Request Headers:', req.headers);
    console.log('New Pass = ' + new_Password_Object_DTO.password);

    try {
      new_Password_Object_DTO.password = await bcrypt.hash(
        new_Password_Object_DTO.password,
        12,
      );
      const result = await this.authService.UpdatePassword(
        req,
        new_Password_Object_DTO.password,
      );
      if (result) {
        return true;
      } else {
        return new InternalServerErrorException('Customer Service issue = ');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Change Password Auth Controller error = ' + e.message,
      );
    } finally {
      //   Destroy the JWT
      return await this.authService.destroy_temporary_JWT(req);
    }
  }
}
