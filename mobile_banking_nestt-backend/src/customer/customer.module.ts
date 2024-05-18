import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PaymentEntity,
  OtpEntity,
  CustomerEntity,
  SessionEntity,
  UserEntity,
} from './customer.entity';
import { MapperService } from './mapper.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './auth/token_blacklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
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
  controllers: [CustomerController],
  providers: [
    CustomerService,
    MapperService,
    JwtService,
    TokenBlacklistService,
  ],
  exports: [CustomerService], // If you don't add this, it will provide an error
})
export class CustomerModule {}
