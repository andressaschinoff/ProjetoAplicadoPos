import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';

import Fair from './Fair';
import OrderToSeller from './OrderToSeller';
import Troller from './Troller';

// @Check(`'role' = 'buyer' AND 'zipcode' <> null AND address <> null`)
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

  @OneToMany(() => Troller, troller => troller.user, { nullable: true })
  trollers: Troller[];

  @OneToMany(() => OrderToSeller, orderSeller => orderSeller.user, {
    nullable: true,
    eager: true,
  })
  orderSellers: OrderToSeller[];

  @ManyToOne(() => Fair, fair => fair.users, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'fair_id', referencedColumnName: 'id' }])
  fair: Fair;

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
