import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Type } from '../enum/Type';
import Product from './Product';
import User from './User';

@Entity('fair')
export default class Fair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  zipcode: number;

  @Column()
  address: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ name: 'week_day' })
  weekDay: string;

  @Column()
  opening: string;

  @Column()
  closing: string;

  @Column({ name: 'delivery_price' })
  deliveryPrice: number;

  @Column({ name: 'money_sign', type: 'float' })
  moneySign: number;

  @Column({ type: 'enum', array: true, enum: Type })
  types: Type[];

  @OneToMany(() => Product, product => product.fair)
  products: Product[];

  @OneToMany(() => User, user => user.fair)
  users: User[];

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
