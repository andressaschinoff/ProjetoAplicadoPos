import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import Client from './Client';
import Products from './Products';

@Entity('troller')
export default class Troller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ default: true })
  active: boolean;

  @ManyToMany(() => Products, products => products.trollers)
  products: Products[];

  @ManyToOne(() => Client, client => client.trollers)
  client: Client;

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