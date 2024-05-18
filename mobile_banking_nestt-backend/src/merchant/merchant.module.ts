import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentEntity,
  OtpEntity,
  MerchantEntity,
  SessionEntity,
  UserEntity,
} from './merchant.entity';
import { MapperService } from './mapper.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './auth/token_blacklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      MerchantEntity,
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
  controllers: [MerchantController],
  providers: [
    MerchantService,
    MapperService,
    JwtService,
    TokenBlacklistService,
  ],
  exports: [MerchantService], // If you don't add this, it will provide an error
})
export class MerchantModule {}
