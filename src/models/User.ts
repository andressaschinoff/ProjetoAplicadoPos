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
} from 'typeorm';

import Fair from './Fair';
import Troller from './Troller';

@Entity('users')
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

  @Column()
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

  @ManyToOne(() => Fair, fair => fair.users, { nullable: true })
  @JoinColumn({ name: 'fair_id' })
  fair: Fair;

  @OneToMany(() => Troller, troller => troller.client, { nullable: true })
  trollers: Troller[];

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
