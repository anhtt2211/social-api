import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTableUser1711509141465 implements MigrationInterface {
  name = "alterTableUser1711509141465";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "full_name" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "full_name"`);
  }
}
