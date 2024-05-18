import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => PaymentEntity, (billing) => billing.user)
  payment: PaymentEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity[];
}

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nid: string;

  // @Column({ unique: true })
  @Column()
  phone: string;

  @Column()
  credit_amount: number;

  @Column()
  image: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // user_id: number;

  @Column()
  amount: number;

  @Column()
  payment_date: string;

  @Column()
  payment_type: string;

  @Column()
  receiver_info: string;

  @Column({ nullable: true })
  card_number: string;

  @Column({ nullable: true })
  card_validity: string;

  @Column({ nullable: true })
  card_holder_name: string;

  @Column({ nullable: true })
  card_cvv: string;

  @ManyToOne(() => UserEntity, (user) => user.payment)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

@Entity('session')
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // user_id: number;

  @Column()
  jwt_token: string;

  @Column()
  expiration_date: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

@Entity('otp')
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: string;

  @Column({ nullable: true })
  expiration_date: string;

  @ManyToOne(() => UserEntity, (user) => user.otp)
  user: UserEntity;
}
