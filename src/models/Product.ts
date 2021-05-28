import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Type } from '../enum/Type';
import Fair from './Fair';
import OrderItem from './OrderItem';

@Entity('product')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ name: 'count_in_stock', nullable: true })
  countInStock: number;

  @Column({ name: 'units_of_measure' })
  unitsOfMeasure: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ManyToOne(() => Fair, fair => fair.products, { nullable: false })
  @JoinColumn({ name: 'fair_id' })
  fair: Fair;

  @OneToMany(() => OrderItem, orderItens => orderItens.product)
  orderItens: OrderItem[];

  @CreateDateColumn({
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
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
