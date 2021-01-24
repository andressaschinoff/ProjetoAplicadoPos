import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Type } from '../enum/Type';
import Product from './Product';

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

  @CreateDateColumn({
    name: 'date_create',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'date_update',
  })
  updateAt: Date;

  // @ManyToMany(() => Product, product => product.id, { cascade: true })
  // @JoinTable({
  //   name: 'fair_products',
  //   joinColumn: {
  //     name: 'id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // products: Product[];

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
