import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { Request } from "express";
import { TokenBlacklistService } from "./token_blacklist.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private token_blacklistService: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("JWT token not found");
      //  Token Already destroyed
    }
    try {
      const isBlacklisted =
        await this.token_blacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException("JWT token is blacklisted");
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request["user"] = payload;
    } catch (e) {
      //   Not the real user, Destroy the token
      request["user"] = null;
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
