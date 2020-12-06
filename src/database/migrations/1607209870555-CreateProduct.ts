import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProduct1607209870555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fm_product',
        columns: [
          {
            name: 'id_product',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nm_product',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'vl_product',
            type: 'money',
            isNullable: false,
          },
          {
            name: 'tp_product',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ds_product',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dt_inc',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'dt_alt',
            type: 'timestamp with time zone',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('fm_product');
  }
}
