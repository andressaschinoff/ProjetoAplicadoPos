import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Type } from '../../enum/Type';

export class CreateFairTypes1611453141986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fair_types',
        columns: [
          {
            name: 'type',
            type: 'enum',
            enum: Object.keys(Type),
          },
          {
            name: 'fair_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'fair_types',
      new TableForeignKey({
        name: 'fairType',
        columnNames: ['fair_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fair',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('fair_types', 'fairType');
    await queryRunner.dropTable('fair_types');
  }
}
