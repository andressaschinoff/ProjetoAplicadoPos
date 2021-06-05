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
  Check,
} from 'typeorm';

import Fair from './Fair';
import Troller from './Troller';

// @Check(`'role' = 'buyer' AND 'zipcode' <> null AND address <> null`)
@Entity('user')
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

  @Column({ default: 'buyer' })
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

  @ManyToOne(() => Fair, fair => fair.users, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'fair_id', referencedColumnName: 'id' }])
  fair: Fair;

  @OneToMany(() => Troller, troller => troller.user, { nullable: true })
  trollers: Troller[];

  // @OneToMany(() => Troller, troller => troller.seller, { nullable: true })
  // ordemNumbers: Troller[];

  @BeforeInsert()
  createDates() {
    this.createAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updateAt = new Date();
  }
}
