import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import Fair from './Fair';
import OrderToSeller from './OrderToSeller';
import Troller from './Troller';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  telephone: string;

  @Column({ default: 'buyer' })
  role: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn({
    name: 'date_create',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'date_update',
  })
  updateAt: Date;

  @OneToOne(() => Fair, fair => fair.user)
  fair: Fair;

  @OneToMany(() => Troller, troller => troller.user, { nullable: true })
  trollers: Troller[];

  @OneToMany(() => OrderToSeller, orderSeller => orderSeller.user, {
    nullable: true,
  })
  orderSellers: OrderToSeller[];

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
