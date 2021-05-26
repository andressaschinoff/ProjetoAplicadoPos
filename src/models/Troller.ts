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
import Products from './Products';
import User from './User';

@Entity('troller')
export default class Troller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToMany(() => Products, products => products.trollers, { nullable: true })
  products: Products[];

  @ManyToOne(() => User, user => user.trollers, { nullable: true })
  user: User;

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
