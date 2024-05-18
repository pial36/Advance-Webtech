import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Put,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpCode,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import {
  ForgetPasswordDTO,
  OTP_ReceiverDTO,
  Merchant_ProfileDTO,
  MerchantDto,
  Payment_ReceiverDTO,
} from './merchant.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('api/merchant')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly jwtService: JwtService,
  ) {
    // Empty Constructor
  }

  @Get('/index')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  getIndex(): any {
    return 'Relax! Merchant is Alive.';
  }
  @Get('/merchant_service')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  getService(): any {
    return this.merchantService.get_service();
  }

  //   ################################################################# FEATURES ################################################################

  //   #1

  /**
   * This function Signup.
   * @param {MerchantDto} x - The first number.
   * @returns {any} The sum of x and y.
   */

  //region Authentication

  @Post('/signup/merchant_details')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async merchant_Details_Create(
    @Body() merchant_info: MerchantDto,
  ): Promise<any> {
    try {
      const saved_merchant =
        await this.merchantService.Create_Merchant(merchant_info);
      if (saved_merchant > 0) {
        return saved_merchant;
      } else {
        throw new InternalServerErrorException(
          'merchant data could not be saved',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }

  //endregion

  //   #2
  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async View_own_Profile(@Request() req): Promise<any> {
    try {
      return await this.merchantService.Find_Merchant_By_Email(req.user.email);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  //   #3
  @Put('/profile/update')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Update_own_Profile(
    @Request() req,
    @Body() updated_data: Merchant_ProfileDTO,
  ): Promise<any> {
    try {
      return await this.merchantService.Update_Own_Profile_Details(
        req.user.email,
        updated_data,
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  // # : Upload & Update Merchant Image
  @Put('/profile/upload')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 5000000 }, // 5 MB
      storage: diskStorage({
        destination: './uploaded_pic/profile_images',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async UploadProfileImage(
    @Request() req,
    @UploadedFile() myfileobj: Express.Multer.File,
  ): Promise<any> {
    console.log(myfileobj); // We can find the file name here
    if (myfileobj == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Please Upload Image',
      });
    }
    const seller = await this.merchantService.Update_Profile_Picture(
      req.user.email,
      myfileobj.filename,
    );
    if (seller != null) {
      return seller;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No Seller Found to Upload Seller Image',
      });
    }
  }

  @Get('/profile/view_profile_image')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async getSellerImages(@Request() req, @Res() res): Promise<any> {
    try {
      return this.merchantService.Get_Profile_Picture(req.user.email, res);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('/send_money')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Create_Billing(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      console.log('User Email from req = ' + req.user.email);
      console.log('User Password from bill = ' + req.user.email);
      console.log('Receiver Email from bill = ' + bill.receiver_info);
      console.log('Payment amount from bill = ' + bill.amount);
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );
      const bill_copy = bill;

      if (user_validity_decision) {
        const receiver = await this.merchantService.getUserByEmail(
          bill.receiver_info,
        );
        if (receiver != null) {
          bill.payment_type = 'Send Money';
          const decision = await this.merchantService.Subtract_Credits_Amount(
            req.user.email,
            bill,
          );
          // Cash-in to an account
          // Search user by email
          // Use request type as cash in to that account

          bill_copy.payment_type = 'Cash in';
          console.log('Payment Type' + bill_copy.payment_type);
          const decision_add = await this.merchantService.Add_Credits_Amount(
            await receiver.email,
            bill_copy,
          );

          if (decision > 0 && decision_add > 0) {
            return {
              success: true,
              message: 'Money has been transferred successfully',
            };
          } else {
            throw new InternalServerErrorException(
              'Payment Could not be completed',
            );
          }
        } else {
          throw new InternalServerErrorException(
            'Payment Could not be completed because Receiver email did not matched',
          );
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/cash_out')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Withdraw(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );
      const bill_copy = bill;

      if (user_validity_decision) {
        const receiver = await this.merchantService.getUserByEmail(
          bill.receiver_info,
        );
        if (receiver != null) {
          bill.payment_type = 'Cash Out';
          const decision = await this.merchantService.Subtract_Credits_Amount(
            req.user.email,
            bill,
          );
          // Cash-in to Agents account
          // Search user by email
          // Use request type as cash in to that account
          bill_copy.payment_type = 'Cash in';
          const decision_add = await this.merchantService.Add_Credits_Amount(
            await receiver.email,
            bill_copy,
          );
          if (decision > 0 && decision_add > 0) {
            return {
              success: true,
              message: 'Money has been transferred successfully',
            };
          } else {
            throw new InternalServerErrorException(
              'Payment Could not be completed  because of Credit Subtraction or Wrong Receiver Email',
            );
          }
        } else {
          throw new InternalServerErrorException(
            'Payment Could not be completed because Receiver email did not matched',
          );
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/bill_payment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Bill_Payment(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );

      const bill_copy = bill;
      if (user_validity_decision) {
        const receiver = await this.merchantService.getUserByEmail(
          bill.receiver_info,
        );
        if (receiver != null) {
          bill.payment_type = 'Bill Payment';
          const decision = await this.merchantService.Subtract_Credits_Amount(
            req.user.email,
            bill,
          );
          // Cash-in to an account
          // Search user by email
          // Use request type as cash in to that account
          bill_copy.payment_type = 'Bill Received';
          const decision_add = await this.merchantService.Add_Credits_Amount(
            await receiver.email,
            bill_copy,
          );
          if (decision > 0 && decision_add > 0) {
            return {
              success: true,
              message: 'Money has been transferred successfully',
            };
          } else {
            throw new InternalServerErrorException(
              'Payment Could not be completed',
            );
          }
        } else {
          throw new InternalServerErrorException(
            'Payment Could not be completed because Receiver email did not matched',
          );
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/cash_in')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Cash_In(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );

      if (user_validity_decision) {
        bill.payment_type = 'Cash In';
        const decision = await this.merchantService.Add_Credits_Amount(
          req.user.email,
          bill,
        );

        if (decision > 0) {
          return {
            success: true,
            message: 'Money has been transferred successfully',
          };
        } else {
          throw new InternalServerErrorException(
            'Payment Could not be completed',
          );
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/add_money/wallet_to_bank')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Wallet_to_Bank(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );

      const bill_copy = bill;

      if (user_validity_decision) {
        const receiver = await this.merchantService.getUserByEmail(
          bill.receiver_info,
        );
        if (receiver != null) {
          bill.payment_type = 'Wallet to Bank';
          const decision = await this.merchantService.Subtract_Credits_Amount(
            req.user.email,
            bill,
          );

          bill_copy.payment_type = 'Received From Wallet';
          const decision_add = await this.merchantService.Add_Credits_Amount(
            await receiver.email,
            bill_copy,
          );

          if (decision > 0 && decision_add > 0) {
            return {
              success: true,
              message: 'Money has been transferred successfully',
            };
          } else {
            throw new InternalServerErrorException(
              'Payment Could not be completed due to Receiver Not found or Sender Password issue',
            );
          }
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/add_money/wallet_to_card')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Wallet_to_Card(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );

      if (user_validity_decision) {
        bill.payment_type = 'Wallet to Card';
        const decision = await this.merchantService.Subtract_Credits_Amount(
          req.user.email,
          bill,
        );

        if (decision > 0) {
          return {
            success: true,
            message: 'Money has been transferred successfully',
          };
        } else {
          throw new InternalServerErrorException(
            'Payment Could not be completed',
          );
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Post('/add_money/bank_to_wallet')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Bank_to_Wallet(
    @Request() req,
    @Body() bill: Payment_ReceiverDTO,
  ): Promise<any> {
    try {
      const user_validity_decision = await this.merchantService.user_validity(
        req.user.email,
        bill.password,
      );

      const bill_copy = bill;

      if (user_validity_decision) {
        const receiver = await this.merchantService.getUserByEmail(
          bill.receiver_info,
        );

        if (receiver != null) {
          bill.payment_type = 'Bank to Bank';
          const decision = await this.merchantService.Subtract_Credits_Amount(
            bill.receiver_info,
            bill,
          );

          bill_copy.payment_type = 'Bank to Wallet';
          const decision_add = await this.merchantService.Add_Credits_Amount(
            req.user.email,
            bill_copy,
          );

          if (decision > 0 && decision_add > 0) {
            return {
              success: true,
              message: 'Money has been transferred successfully',
            };
          } else {
            throw new InternalServerErrorException(
              'Payment Could not be completed',
            );
          }
        }
      } else {
        throw new BadRequestException('Password did not matched!');
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Merchant Controller Create Billing Error = ' + e.message,
      );
    }
  }

  @Get('/payment/list')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Get_All_Billing(@Request() req): Promise<any> {
    try {
      const payment_list = this.merchantService.Get_All_Billing_Payment(
        req.user.email,
      );

      if (payment_list != null) {
        return payment_list;
      } else {
        throw new NotFoundException('Data not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('/payment/list/cash_in')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Get_All_Cash_in(@Request() req): Promise<any> {
    try {
      const payment_list =
        await this.merchantService.Get_All_Billing_Payments_By_Payment_Type(
          req.user.email,
          'Cash in',
        );

      // console.log('Payment Cash in List:');
      // payment_list.forEach((payment_list) => {
      //   console.log('Amount = ' + payment_list.amount);
      //   console.log('Amount = ' + payment_list.payment_type);
      //   console.log('Amount = ' + payment_list.receiver_info);
      // });
      if (payment_list != null) {
        return payment_list;
      } else {
        throw new NotFoundException('Data not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('/forget_password')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Forget_Password(
    @Body() forgetPassword_DTO: ForgetPasswordDTO,
  ): Promise<any> {
    try {
      const decision = await this.merchantService.ForgetPassword(
        forgetPassword_DTO.email,
      );
      if (decision != false) {
        return decision;
      } else {
        throw new NotFoundException('Data not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('/otp')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async OTP_Verification(
    @Request() req,
    @Body() OTP_Object: OTP_ReceiverDTO,
  ): Promise<any> {
    // console.log('Request Headers:', req.headers);
    try {
      // console.log('User provided otp = ' + OTP_Object.otp);
      const decision = await this.merchantService.otp_verification(
        req,
        OTP_Object.otp,
      );
      if (decision) {
        console.log('Returning True');
        return {
          success: true,
          message: 'OTP verification successful',
        };
      } else {
        console.log('Returning Error');
        throw new BadRequestException('OTP did not matched!');
      }
    } catch (e) {
      throw e;
    }
  }

  @Get('/navbar_info')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK) // Set the status code to 200 (OK)
  async Navbar(@Request() req): Promise<any> {
    console.log('Got email = ' + req.user.email);
    try {
      const navbar_data = await this.merchantService.navbar(req.user.email);
      // console.log('Request Headers:', req.headers);
      console.log('merchant_name = ' + navbar_data.name);
      console.log('merchant money = ' + navbar_data.credit_amount);

      if (navbar_data.name !== null && navbar_data.credit_amount != null) {
        return navbar_data;
      } else {
        throw new NotFoundException('Data not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
