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
  Generated,
  ManyToMany,
  JoinTable,
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

  @Column({
    name: 'order_number',
    unique: true,
    update: false,
  })
  @Generated('increment')
  orderNumber: number;

  @OneToMany(() => OrderItem, orderItens => orderItens.troller, {
    nullable: true,
    eager: true,
  })
  orderItens: OrderItem[];

  @ManyToOne(() => Fair, fair => fair.trollers, { nullable: true, eager: true })
  @JoinColumn([{ name: 'fair_id', referencedColumnName: 'id' }])
  fair: Fair;

  @ManyToOne(() => User, user => user.trollers, { nullable: true, eager: true })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToMany(type => User, {
    nullable: true,
    eager: true,
    cascade: ['update'],
  })
  @JoinTable({
    name: 'ordem_numbers_sellers',
    joinColumn: {
      name: 'ordem_number',
      referencedColumnName: 'orderNumber',
    },
    inverseJoinColumn: {
      name: 'seller_id',
      referencedColumnName: 'id',
    },
  })
  sellers: User[];

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
