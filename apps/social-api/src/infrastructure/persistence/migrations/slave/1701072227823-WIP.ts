import { MigrationInterface, QueryRunner } from "typeorm";

export class WIP1701072227823 implements MigrationInterface {
  name = "WIP1701072227823";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "name" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "size" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "mimeType" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "key" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "key" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "mimeType" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "size" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "name" SET NOT NULL`
    );
  }
}
