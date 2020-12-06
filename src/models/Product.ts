import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fm_product')
class Product {
  @PrimaryGeneratedColumn({ name: 'id_product', type: 'uuid' })
  id: string;
  @Column({ name: 'nm_product' })
  name: string;
  @Column({ name: 'vl_product', type: 'money' })
  price: number;
  @Column({ name: 'tp_product' })
  type: string;
  @Column({ name: 'ds_product' })
  description: string;
  @Column({ name: 'dt_inc', type: 'time with time zone' })
  dateInc: Date;
  @Column({ name: 'dt_alt', type: 'time with time zone' })
  dateAlt: Date;
}

export default Product;
