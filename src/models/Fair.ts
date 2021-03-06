import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Type } from '../enum/Type';
import Product from './Product';
import Troller from './Troller';
import User from './User';

@Entity('fair')
export default class Fair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  zipcode: string;

  @Column()
  address: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  numberOfScores: number;

  @Column({ name: 'week_day' })
  weekdays: string;

  @Column()
  opening: string;

  @Column()
  closing: string;

  @Column({ name: 'delivery_price' })
  deliveryPrice: number;

  @Column({ name: 'money_sign', type: 'float', default: 0 })
  moneySign: number;

  @Column({ type: 'enum', array: true, enum: Type })
  types: Type[];

  @OneToOne(() => User)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Product, product => product.fair)
  products: Product[];

  @OneToMany(() => Troller, troller => troller.fair)
  trollers: Troller[];

  @CreateDateColumn({
    name: 'date_create',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'date_update',
  })
  updateAt: Date;

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
