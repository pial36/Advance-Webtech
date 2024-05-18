import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { MerchantService } from '../merchant.service';
import { LoginDTO } from '../merchant.dto';
import { Request } from 'express';
import { TokenBlacklistService } from './token_blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private merchantService: MerchantService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}
  async signUp(myobj: LoginDTO): Promise<any> {
    return await this.merchantService.Create_Signup(myobj);
  }
  async signIn(logindata: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.merchantService.Login(logindata);
    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }
    if (!(await bcrypt.compare(logindata.password, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const payload = logindata;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout(email: string, token: string): Promise<any> {
    try {
      // Blacklist the token
      const decision = await this.tokenBlacklistService.addToBlacklist(
        email,
        token,
      );

      if (decision != null) {
        return decision;
      } else {
        throw new InternalServerErrorException(
          'Problem in Token Blacklist Service',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async UpdatePassword(req: Request, password: string): Promise<any> {
    try {
      const decision = await this.merchantService.Update_Password(
        req,
        password,
      );
      if (decision !== null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Update Password Auth Service error = ' + e.message,
      );
    }
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async destroy_temporary_JWT(req: Request): Promise<any> {
    try {
      const token = await this.extractTokenFromHeader(req);

      const user = await this.merchantService.get_user_from_Request(req);

      // Blacklist the token
      const decision = await this.tokenBlacklistService.addToBlacklist(
        user.email,
        token,
      );

      if (decision != null) {
        return decision;
      } else {
        throw new InternalServerErrorException(
          'Problem in Token Blacklist Service',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
