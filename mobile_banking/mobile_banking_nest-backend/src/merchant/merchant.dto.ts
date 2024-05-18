import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Signup Purpose
export class MerchantDto {
  @IsNotEmpty({ message: 'Id cannot be empty or null' })
  id: number;
  // Name
  @IsNotEmpty({ message: 'Name cannot be empty or null' })
  @IsString({ message: 'Name should be a string' })
  @MinLength(3, { message: 'Name should be at least 3 characters long' })
  @MaxLength(50, {
    message: 'Name should not be more than 50 characters long',
  })
  name: string;

  // Nid
  @IsNotEmpty({ message: 'NID cannot be empty or null' })
  nid: string;

  // Phone
  @IsNotEmpty({ message: 'Phone number cannot be empty or null' })
  phone: string;

  // Image
  @IsString({ message: 'Profile Image Name should be a string' })
  image: string;

  // User ID
  @IsNotEmpty({ message: 'User id cannot be empty or null' })
  user_id: number;
}

export class LoginDTO {
  // Email
  @IsNotEmpty({ message: 'Email cannot be empty or null' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(100, {
    message: 'Email should not be more than 100 characters long',
  })
  email: string;

  // Password
  @IsNotEmpty({ message: 'Password cannot be empty or null' })
  @IsString({ message: 'Password should be a string' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/,
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    },
  )
  password: string;
}

// My Profile Showcase
export class Merchant_ProfileDTO {
  @IsNotEmpty({ message: 'Id cannot be empty or null' })
  id: number;
  // Name
  @IsNotEmpty({ message: 'Name cannot be empty or null' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  // Email
  @IsNotEmpty({ message: 'Email cannot be empty or null' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  // Nid
  @IsNotEmpty({ message: 'Gender cannot be empty or null' })
  nid: string;

  // Phone
  @IsNotEmpty({ message: 'Phone number cannot be empty or null' })
  phone: string;

  // Image
  @IsString({ message: 'Profile Image Name should be a string' })
  image: string;
}

export class PaymentDTO {
  // Id
  @IsNotEmpty({ message: 'ID cannot be empty or null' })
  id: number;

  // Appointment Date
  @IsNotEmpty({ message: 'Payment Amount cannot be empty or null' })
  amount: string;

  // Appointment Time
  @IsNotEmpty({ message: 'Payment Date cannot be empty or null' })
  payment_date: string;

  // Payment To
  @IsNotEmpty({ message: 'Payment To cannot be empty or null' })
  payment_to: string;

  // Patient id
  @IsNotEmpty({ message: 'user id cannot be empty or null' })
  user_id: number;
}

export class ForgetPasswordDTO {
  // Email
  @IsNotEmpty({ message: 'Email cannot be empty or null' })
  email: string;
}

export class OTP_ReceiverDTO {
  // OTP
  @IsNotEmpty({ message: 'OTP cannot be empty or null' })
  otp: string;
}

export class New_PasswordDTO {
  // Password
  @IsNotEmpty({ message: 'Password cannot be empty or null' })
  @IsString({ message: 'Password should be a string' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/,
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    },
  )
  password: string;
}

export class Payment_ReceiverDTO {
  // Amount
  @IsNotEmpty({ message: 'Amount cannot be empty or null' })
  amount: string;

  @IsNotEmpty({ message: 'Payment Type cannot be empty or null' })
  payment_type: string;

  //
  @IsNotEmpty({ message: 'Receiver Email cannot be empty or null' })
  receiver_info: string;

  // Card details (nullable)
  card_number: string;
  card_validity: string;
  card_holder_name: string;
  card_cvv: string;

  // Password
  @IsNotEmpty({ message: 'Password cannot be empty or null' })
  @IsString({ message: 'Password should be a string' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/,
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    },
  )
  password: string;
}

export class NavbarDTO {
  name: string;
  credit_amount: number;
}
