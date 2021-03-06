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
} from 'typeorm';
import { Type } from '../enum/Type';
import Fair from './Fair';
import Products from './Products';

@Entity('product')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ManyToOne(() => Fair, fair => fair.products, { nullable: false })
  @JoinColumn({ name: 'fair_id' })
  fair: Fair;

  @OneToOne(() => Products, products => products.product)
  products: Products;

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
