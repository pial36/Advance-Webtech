import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { AgentModule } from '../Agent.module';
import { TokenBlacklistService } from './token_blacklist.service';

@Module({
  imports: [
    AgentModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService, TokenBlacklistService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
