import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleTable1706607601995 implements MigrationInterface {
  name = "UpdateArticleTable1706607601995";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "readingTime"`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD "readingTime" double precision NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "readingTime"`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD "readingTime" integer NOT NULL DEFAULT '0'`
    );
  }
}
