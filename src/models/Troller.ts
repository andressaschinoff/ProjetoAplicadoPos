import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Fair from './Fair';
import OrderItem from './OrderItem';
import User from './User';

@Entity('troller')
export default class Troller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  subtotal: number;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => OrderItem, orderItens => orderItens.troller, {
    nullable: true,
  })
  orderItens: OrderItem[];

  @ManyToOne(() => Fair, fair => fair.trollers, { nullable: true })
  fair: Fair;

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
