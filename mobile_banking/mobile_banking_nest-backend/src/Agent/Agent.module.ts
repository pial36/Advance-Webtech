import { Module } from '@nestjs/common';
import { AgentController } from './Agent.controller';
import { AgentService } from './Agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentEntity,
  OtpEntity,
  agentEntity,
  SessionEntity,
  UserEntity,
} from './Agent.entity';
import { MapperService } from './mapper.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './auth/token_blacklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      agentEntity,
      PaymentEntity,
      SessionEntity,
      OtpEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: 'mySecretKey123!@#',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AgentController],
  providers: [
    AgentService,
    MapperService,
    JwtService,
    TokenBlacklistService,
  ],
  exports: [AgentService], // If you don't add this, it will provide an error
})
export class AgentModule {}
