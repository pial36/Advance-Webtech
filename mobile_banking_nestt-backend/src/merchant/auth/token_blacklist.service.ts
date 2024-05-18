import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MerchantService } from '../merchant.service';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(private patientService: MerchantService) {}

  async addToBlacklist(email: string, token: string): Promise<any> {
    try {
      const currentDate = new Date();
      const dateString = currentDate.toISOString(); // Convert date to ISO string

      const decision = await this.patientService.addToBlacklist(
        token,
        dateString,
        email,
      );

      if (decision) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    // return this.blacklistedTokens.has(token);
    const data = await this.patientService.get_token_by_token(token);
    return !!data;
  }
}
